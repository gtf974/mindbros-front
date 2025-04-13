export default function Matchmaking({ socket }) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-gray-700">Clique ci-dessous pour trouver une partie :</p>
        <button
          onClick={() => socket.emit('find-match')}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          🔎 Trouver une partie
        </button>
      </div>
    );
  }
  