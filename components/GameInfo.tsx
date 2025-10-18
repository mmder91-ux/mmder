
import React from 'react';
import { Player, Scores } from '../types';

interface GameInfoProps {
  currentPlayer: Player;
  scores: Scores;
  gameOver: boolean;
  winner: Player | 'draw' | null;
}

const PlayerScore: React.FC<{ player: Player; score: number; isCurrent: boolean }> = ({ player, score, isCurrent }) => {
  const bgColor = player === Player.Black ? 'bg-black text-white' : 'bg-white text-black';
  const turnIndicator = isCurrent ? 'ring-4 ring-yellow-400' : 'ring-2 ring-gray-400';

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg w-full ${bgColor} ${turnIndicator} transition-all duration-300`}>
      <span className="font-bold text-lg">{player === Player.Black ? 'Black' : 'White'}</span>
      <span className="text-2xl font-bold">{score}</span>
    </div>
  );
};

const GameInfo: React.FC<GameInfoProps> = ({ currentPlayer, scores, gameOver, winner }) => {
  
  const renderStatus = () => {
    if (gameOver) {
      if (winner === 'draw') {
        return <h2 className="text-2xl font-bold text-yellow-400">It's a Draw!</h2>;
      }
      const winnerName = winner === Player.Black ? 'Black' : 'White';
      return <h2 className="text-3xl font-bold text-yellow-400">{winnerName} Wins!</h2>;
    }
    const turnName = currentPlayer === Player.Black ? 'Black' : 'White';
    return <h2 className="text-2xl font-bold text-white">Turn: {turnName}</h2>;
  };
  
  return (
    <div className="bg-wood-light border-4 border-wood-dark p-4 rounded-lg shadow-xl w-64 mb-4">
      <div className="flex flex-col items-center gap-4">
        <PlayerScore player={Player.Black} score={scores[Player.Black]} isCurrent={!gameOver && currentPlayer === Player.Black} />
        <PlayerScore player={Player.White} score={scores[Player.White]} isCurrent={!gameOver && currentPlayer === Player.White} />
        <div className="mt-2 text-center h-10 flex items-center justify-center">
            {renderStatus()}
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
