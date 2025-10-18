
import React from 'react';
import { BoardState, Move, Player } from '../types';
import Cell from './Cell';
import { BOARD_SIZE } from '../constants';

interface BoardProps {
  board: BoardState;
  validMoves: Move[];
  onCellClick: (row: number, col: number) => void;
  currentPlayer: Player;
}

const Board: React.FC<BoardProps> = ({ board, validMoves, onCellClick, currentPlayer }) => {
  return (
    <div className="bg-othello-green p-2 shadow-2xl rounded-lg border-4 border-wood-light">
      <div className={`grid grid-cols-${BOARD_SIZE} gap-px bg-black`}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isValidMove = validMoves.some(
              (move) => move.row === rowIndex && move.col === colIndex
            );
            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                state={cell}
                isValidMove={isValidMove}
                onClick={() => onCellClick(rowIndex, colIndex)}
                currentPlayer={currentPlayer}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;
