interface PlayedCardsProps {
  playedCards: { name: string; card: string }[];
}


function PlayedCards({ playedCards }: PlayedCardsProps) {
  return (
    <div className="flex flex-col items-center justify-start bg-gray-800 rounded-lg border border-gray-700 p-4 my-8 max-h-[400px] overflow-hidden">
      <h2 className="text-md font-semibold text-purple-300 mb-2 select-none">
        🪄 Played Cards
      </h2>
      <ul className="space-y-1 text-sm w-full max-w-md text-center">
        {playedCards
          .slice()
          .reverse()
          .map((c, i) => (
            <li
              key={i}
              className="flex items-center justify-between bg-gray-700 px-4 py-1 rounded select-none"
            >
              <span className="font-medium text-white">{c.name}</span>
              <span className="text-pink-300">{c.card}</span>
            </li>
          ))}
        {playedCards.length === 0 && (
          <li className="text-gray-500 italic select-none">
            No cards played yet.
          </li>
        )}
      </ul>
    </div>
  );
}

export default PlayedCards;