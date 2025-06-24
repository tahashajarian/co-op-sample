interface PlayerProps {
  id: string;
  name: string;
  isSelf: boolean;
  isCurrent: boolean;
  health: number;
  turnTimeLeft: number;
  playCard: (type: string, value: number) => void;
}

function Player({
  name,
  isSelf,
  isCurrent,
  health,
  turnTimeLeft,
  playCard,
}: PlayerProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-gray-700 p-6 rounded-lg border-2 shadow select-none w-52 h-72 ${
        health > 0
          ? isCurrent
            ? "border-green-500"
            : "border-gray-600"
          : "border-red-500 opacity-50"
      }`}
    >
      <div className="absolute top-0 w-48">
        <div className="w-full bg-gray-700 rounded h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${(health / 100) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-300">{health}/100</div>
      </div>
      <div className="text-4xl mt-8">{isSelf ? "🧑" : "🧙"}</div>
      <div className="font-bold mt-3 text-xl">
        {name} {health <= 0 && "(Defeated)"}
      </div>
      {isSelf && health > 0 && (
        <div className="mt-auto w-full">
          <div className="text-sm mb-2 text-center">
            {isCurrent
              ? `Your turn, time left: ${turnTimeLeft}`
              : "Waiting for your turn..."}
          </div>
          <div className="space-x-4 flex w-full">
            <button
              onClick={() => playCard("attack", 10)}
              disabled={!isCurrent}
              className={`px-4 py-2 w-full text-white rounded text-sm ${
                isCurrent
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-400 cursor-not-allowed"
              }`}
            >
              Attack
            </button>
            <button
              onClick={() => playCard("heal", 10)}
              disabled={!isCurrent}
              className={`px-4 py-2 w-full text-white rounded text-sm ${
                isCurrent
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-400 cursor-not-allowed"
              }`}
            >
              Heal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Player;