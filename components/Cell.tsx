
import React from 'react';
import { CellState, Player } from '../types';

interface CellProps {
  state: CellState;
  isValidMove: boolean;
  onClick: () => void;
  currentPlayer: Player;
}

const Cell: React.FC<CellProps> = ({ state, isValidMove, onClick, currentPlayer }) => {
  const cellClasses = "w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-othello-green relative";
  
  const pieceClasses = "w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-transform duration-300 transform";
  
  let piece = null;
  if (state === CellState.Black) {
    piece = <div className={`${pieceClasses} bg-black shadow-piece`}></div>;
  } else if (state === CellState.White) {
    piece = <div className={`${pieceClasses} bg-white shadow-piece-white`}></div>;
  }

  const hintColor = currentPlayer === Player.Black ? 'bg-black/30' : 'bg-white/30';

  return (
    <div className={cellClasses} onClick={onClick}>
      {piece}
      {isValidMove && (
        <div 
          className={`absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full ${hintColor} cursor-pointer transition-opacity duration-200 hover:opacity-75`}
        ></div>
      )}
    </div>
  );
};

export default Cell;
