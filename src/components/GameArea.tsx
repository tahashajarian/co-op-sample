import Monster from "./Monster";
import PlayedCards from "./PlayedCards";
import Player from "./Player";

export interface PlayedCard {
  player: string;
  card: string;
}

interface GameAreaProps {
  players: string[];
  currentTurn: string;
  playedCards: PlayedCard[];
  playerHealth: { [key: string]: number };
  monsterHealth: number;
  turnTimeLeft: number;
  playCard: (type: string, value: number) => void;
  playerId: string;
  getPlayerName: (id: string) => string;
}

function GameArea({
  players,
  currentTurn,
  playedCards,
  playerHealth,
  monsterHealth,
  turnTimeLeft,
  playCard,
  playerId,
  getPlayerName,
}: GameAreaProps) {
  return (
    <div className="w-full max-w-5xl h-full grid grid-rows-[auto_1fr_auto] gap-6">
      <Monster currentTurn={currentTurn} monsterHealth={monsterHealth} />
      <PlayedCards
        playedCards={playedCards.map((c) => ({
          name: getPlayerName(c.player),
          card: c.card,
        }))}
      />
      <div className="flex justify-evenly">
        {players.map((id) => (
          <Player
            key={id}
            id={id}
            name={getPlayerName(id)}
            isSelf={id === playerId}
            isCurrent={id === currentTurn}
            health={playerHealth[id] || 0}
            turnTimeLeft={turnTimeLeft}
            playCard={playCard}
          />
        ))}
      </div>
    </div>
  );
}

export default GameArea;