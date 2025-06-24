interface SessionManagerProps {
  input: string;
  setInput: (value: string) => void;
  status: string;
  createSession: () => void;
  joinSession: () => void;
}

function SessionManager({
  input,
  setInput,
  status,
  createSession,
  joinSession,
}: SessionManagerProps) {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <button
        onClick={createSession}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition select-none"
      >
        Create Session
      </button>
      <div className="space-y-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter session ID"
          className="bg-gray-900 border border-gray-600 p-3 rounded w-full text-sm text-white placeholder-gray-500"
        />
        <button
          onClick={joinSession}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition select-none"
        >
          Join Session
        </button>
      </div>
      <div
        className={`text-sm font-bold ${
          status === "Connected" ? "text-green-500" : "text-red-500"
        }`}
      >
        {status}
      </div>
    </div>
  );
}

export default SessionManager;