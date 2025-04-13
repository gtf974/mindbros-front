import { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';

function App() {
  const [screen, setScreen] = useState('home');
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState(null);
  const [roomCode, setRoomCode] = useState(null);

  const handleStart = (selectedMode, name, code = null) => {
    setUsername(name);
    setMode(selectedMode);
    setRoomCode(code);
    setScreen('game');
  };

  return (
    <div className='rounded-sm shadow-lg shadow-black'>
      {screen === 'home' && <Home onStart={handleStart} />}
      {screen === 'game' && (
        <Game
          username={username}
          mode={mode}
          roomCode={roomCode}
          goHome={() => setScreen('home')}
        />
      )}
    </div>
  );
}

export default App;
