
import React from 'react';

interface ControlsProps {
  onNewGame: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onNewGame }) => {
  return (
    <div className="mt-4 w-64">
      <button
        onClick={onNewGame}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-200"
      >
        New Game
      </button>
    </div>
  );
};

export default Controls;
