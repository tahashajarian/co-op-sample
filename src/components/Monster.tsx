interface MonsterProps {
  currentTurn: string;
  monsterHealth: number;
}

function Monster({ currentTurn, monsterHealth }: MonsterProps) {
  const isMonsterTurn = currentTurn === "monster";
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-gray-700 p-6 rounded-lg border-2 shadow w-52 mx-auto h-72 ${
        isMonsterTurn ? "border-green-500" : "border-gray-600"
      }`}
    >
      <div className="text-5xl select-none">👹</div>
      <div className="text-xl font-bold mt-2 select-none">Monster</div>
      <div className="text-sm text-gray-300 select-none">
        {isMonsterTurn ? "🎯 Monster's Turn" : "Waiting..."}
      </div>
      <div className="absolute top-0 w-48">
        <div className="w-full bg-gray-700 rounded h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${(monsterHealth / 100) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-300">{monsterHealth}/100</div>
      </div>
    </div>
  );
}

export default Monster;
