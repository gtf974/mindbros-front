export default function GameStatus({ status, round }) {
    if (status === 'won') {
      return <div className="text-green-600 text-center text-xl font-semibold">🎉 Partie gagnée en {round-1} tour(s)!</div>;
    }
  
    if (status === 'opponent-left') {
      return <div className="text-red-600 text-center">❌ Ton adversaire a quitté la partie.</div>;
    }
  
    if (status === 'surrendered') {
      return <div className="text-gray-500 text-center">🚪 Tu as abandonné la partie.</div>;
    }
  
    return null;
  }
  