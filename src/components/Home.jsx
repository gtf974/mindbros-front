import { useState } from 'react';

export default function Home({ onStart }) {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');

  return (
    <div className="p-6 space-y-6 text-center max-w-md mx-auto">
      <h1 className="text-3xl font-bold">MindBros 🧠</h1>

      <input
        type="text"
        placeholder="Ton pseudo"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />

      <div className="space-y-3">
        <button
          className="w-full py-2 bg-blue-600 text-white rounded"
          onClick={() => onStart('public', username)}
          disabled={!username}
        >
          🔎 Jouer en public
        </button>

        <div className="flex items-center gap-10">
          <input
            type="text"
            placeholder="Code de la salle"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="border px-3 py-2 rounded flex-grow"
          />
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => onStart('join', username, roomCode)}
            disabled={!username || !roomCode}
          >
            ▶️ Rejoindre
          </button>
        </div>

        <button
          className="w-full py-2 bg-purple-600 text-white rounded"
          onClick={() => onStart('create', username)}
          disabled={!username}
        >
          ➕ Créer une salle privée
        </button>
      </div>
    </div>
  );
}
