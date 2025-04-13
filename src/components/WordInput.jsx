export default function WordInput({ round, word, setWord, canSubmit, onSubmit }) {
  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold text-center">🧠 Tour {round}</p>
      <p className="text-center text-gray-600">Tape ton mot quand tu es prêt.</p>

      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        className="border w-full px-3 py-2 rounded text-lg"
        placeholder="Ton mot..."
        disabled={!canSubmit}
      />

      <button
        onClick={onSubmit}
        disabled={!canSubmit || !word.trim()}
        className={`w-full py-2 rounded text-white ${
          canSubmit ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
        } transition`}
      >
        ✅ Envoyer
      </button>
    </div>
  );
}
