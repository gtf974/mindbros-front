import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Matchmaking from './Matchmaking';
import WordInput from './WordInput';
import GameStatus from './GameStatus';

const socket = io('http://localhost:3000'); // change selon ton env

export default function Game({ username, mode, roomCode, goHome }) {
  const [opponentName, setOpponentName] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [word, setWord] = useState('');
  const [opponentWord, setOpponentWord] = useState(null);
  const [round, setRound] = useState(1);
  const [canSubmit, setCanSubmit] = useState(false);
  const [status, setStatus] = useState('idle');
  const [victoryProposal, setVictoryProposal] = useState(null);
  const [lastRound, setLastRound] = useState(null);

  useEffect(() => {
    socket.on('match-found', ({ roomId }) => {
      setRoomId(roomId);
      setStatus('playing');
      setCanSubmit(true);
      setVictoryProposal(null);
    });

    socket.on('round-result', ({ yourWord, opponentWord, opponentName }) => {
      setLastRound({yourWord, opponentWord, opponentName});
      setOpponentWord(opponentWord);
      setOpponentName(opponentName);
      setVictoryProposal(null);
      setWord('');
      setCanSubmit(true);
      setRound((r) => r + 1);
    });

    socket.on('victory', ({ round }) => {
      setStatus('won');
    });

    socket.on('opponent-abandoned', () => {
      setStatus('opponent-left');
    });

    socket.on('victory-proposed', () => {
      setVictoryProposal('received');
    });

    return () => {
      socket.off('match-found');
      socket.off('round-result');
      socket.off('victory');
      socket.off('opponent-abandoned');
      socket.off('victory-proposed');
    };
  }, []);

  useEffect(() => {
    if (!username || !mode) return;
  
    if (mode === 'public') {
      setStatus('waiting'); // attendre l'autre joueur
      socket.emit('find-match', { username });
    } else if (mode === 'create') {
      const code = generateRoomCode();
      setRoomId(code);
      setStatus('waiting'); // en attente de l'ami
      socket.emit('create-private-room', { roomCode: code, username });
    } else if (mode === 'join') {
      setRoomId(roomCode);
      setStatus('waiting'); // on attend le serveur pour "match-found"
      socket.emit('join-private-room', { roomCode, username });
    }
  }, [username, mode, roomCode]);
  

  const handleSubmit = () => {
    const trimmedWord = word.trim();
    if (!trimmedWord) return;
    socket.emit('submit-word', word);
    setCanSubmit(false);
  };

  const handleProposeVictory = () => {
    socket.emit('propose-victory');
    setVictoryProposal('sent');
  };

  const handleAcceptVictory = () => {
    socket.emit('accept-victory');
  };

  const handleAbandon = () => {
    socket.emit('surrender');
    setStatus('surrendered');
  };

  return (
    <div className="p-6 space-y-6 text-center max-w-md mx-auto">
      <h1 className="text-2xl font-bold">MindBros 🧠</h1>

      <p className="text-gray-500">👤 {username} {opponentName && `et ${opponentName}`}</p>

      {status === 'idle' && <Matchmaking socket={socket} />}
      {status === 'waiting' && (
        <div className="text-center text-gray-600">
          ⏳ En attente d’un autre joueur...
          {roomCode && <p className="text-sm mt-2">Code de la salle : <strong>{roomCode}</strong></p>}
        </div>
      )}

      {status === 'playing' && (
        <div className="space-y-6">
        {/* ⏮️ Review history */}
        {lastRound && (
          <div className="text-left p-4 rounded shadow mb-4 space-y-2">
            <p className="text-sm text-gray-700 font-medium">Tour {round - 1}</p>
            <p>👤 {username} : <em>{lastRound.yourWord}</em></p>
            <p>🆚 {lastRound.opponentName ?? 'Adversaire'} : <em>{lastRound.opponentWord}</em></p>

            {/* Victory proposal logic */}
            {victoryProposal === null && (
              <button
                onClick={() => {
                  socket.emit('propose-victory');
                  setVictoryProposal('sent');
                }}
                className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                🤝 Proposer la victoire
              </button>
            )}

            {victoryProposal === 'received' && (
              <button
                onClick={() => {
                  socket.emit('accept-victory');
                }}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                ✅ Accepter la victoire
              </button>
            )}

            {victoryProposal === 'sent' && (
              <p className="text-sm text-yellow-600 mt-1">En attente de la réponse de l'adversaire...</p>
            )}
          </div>
        )}

        {/* ✍️ New word input */}
        <WordInput
          round={round}
          word={word}
          setWord={setWord}
          canSubmit={canSubmit}
          onSubmit={handleSubmit}
        />
      </div>
      )}


      <GameStatus status={status} round={round} />

      <div className="mt-6">
        <button onClick={goHome} className="text-sm">
          ⬅️ Retour au menu
        </button>
      </div>
    </div>
  );
}

function generateRoomCode(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}
