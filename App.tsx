
import React, { useState, useEffect, useCallback } from 'react';
import { BoardState, CellState, Player, Scores, Move } from './types';
import { BOARD_SIZE, DIRECTIONS } from './constants';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardState>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.Black);
  const [scores, setScores] = useState<Scores>({ [Player.Black]: 0, [Player.White]: 0 });
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  const getOpponent = (player: Player): Player => {
    return player === Player.Black ? Player.White : Player.Black;
  };

  const isMoveValid = (boardState: BoardState, row: number, col: number, player: Player): boolean => {
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE || boardState[row][col] !== CellState.Empty) {
      return false;
    }

    const opponent = getOpponent(player);

    for (const [dr, dc] of DIRECTIONS) {
      let r = row + dr;
      let c = col + dc;
      let hasOpponentPiece = false;

      // FIX: Cast `opponent` to `CellState` for comparison as `boardState` contains `CellState` values.
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && boardState[r][c] === (opponent as CellState)) {
        r += dr;
        c += dc;
        hasOpponentPiece = true;
      }

      // FIX: Cast `player` to `CellState` for comparison as `boardState` contains `CellState` values.
      if (hasOpponentPiece && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && boardState[r][c] === (player as CellState)) {
        return true;
      }
    }
    return false;
  };

  const calculateValidMoves = useCallback((boardState: BoardState, player: Player): Move[] => {
    const moves: Move[] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (isMoveValid(boardState, r, c, player)) {
          moves.push({ row: r, col: c });
        }
      }
    }
    return moves;
  }, []);

  const handleNewGame = useCallback(() => {
    const newBoard: BoardState = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(CellState.Empty));
    const center = BOARD_SIZE / 2;
    newBoard[center - 1][center - 1] = CellState.White;
    newBoard[center - 1][center] = CellState.Black;
    newBoard[center][center - 1] = CellState.Black;
    newBoard[center][center] = CellState.White;
    
    setBoard(newBoard);
    const initialPlayer = Player.Black;
    setCurrentPlayer(initialPlayer);
    setScores({ [Player.Black]: 2, [Player.White]: 2 });
    setGameOver(false);
    setWinner(null);
    setValidMoves(calculateValidMoves(newBoard, initialPlayer));
  }, [calculateValidMoves]);

  useEffect(() => {
    handleNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || !validMoves.some(move => move.row === row && move.col === col)) {
      return;
    }

    const newBoard = board.map(r => [...r]);
    // FIX: Cast `currentPlayer` to `CellState` for assignment as `newBoard` expects `CellState` values.
    newBoard[row][col] = currentPlayer as CellState;
    const opponent = getOpponent(currentPlayer);

    for (const [dr, dc] of DIRECTIONS) {
      const piecesToFlip: Move[] = [];
      let r = row + dr;
      let c = col + dc;

      // FIX: Cast `opponent` to `CellState` for comparison as `newBoard` contains `CellState` values.
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && newBoard[r][c] === (opponent as CellState)) {
        piecesToFlip.push({ row: r, col: c });
        r += dr;
        c += dc;
      }

      // FIX: Cast `currentPlayer` to `CellState` for comparison as `newBoard` contains `CellState` values.
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && newBoard[r][c] === (currentPlayer as CellState)) {
        // FIX: Cast `currentPlayer` to `CellState` for assignment.
        piecesToFlip.forEach(p => newBoard[p.row][p.col] = currentPlayer as CellState);
      }
    }

    setBoard(newBoard);
    
    const opponentValidMoves = calculateValidMoves(newBoard, opponent);
    let nextPlayer = opponent;

    if (opponentValidMoves.length > 0) {
      setCurrentPlayer(opponent);
      setValidMoves(opponentValidMoves);
    } else {
      const currentPlayerValidMoves = calculateValidMoves(newBoard, currentPlayer);
      if (currentPlayerValidMoves.length > 0) {
        // Player gets another turn
        setValidMoves(currentPlayerValidMoves);
      } else {
        // Game over
        setGameOver(true);
        const blackCount = newBoard.flat().filter(cell => cell === CellState.Black).length;
        const whiteCount = newBoard.flat().filter(cell => cell === CellState.White).length;
        if (blackCount > whiteCount) setWinner(Player.Black);
        else if (whiteCount > blackCount) setWinner(Player.White);
        else setWinner('draw');
        setValidMoves([]);
      }
    }
  };

    useEffect(() => {
        if (!board.length) return;
        
        const blackCount = board.flat().filter(cell => cell === CellState.Black).length;
        const whiteCount = board.flat().filter(cell => cell === CellState.White).length;
        setScores({ [Player.Black]: blackCount, [Player.White]: whiteCount });

        if (blackCount + whiteCount === BOARD_SIZE * BOARD_SIZE) {
            setGameOver(true);
            if (blackCount > whiteCount) setWinner(Player.Black);
            else if (whiteCount > blackCount) setWinner(Player.White);
            else setWinner('draw');
        }
    }, [board]);


  return (
    <div className="min-h-screen bg-wood-dark flex flex-col items-center justify-center p-4 font-sans">
      <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Othello</h1>
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        <div className="flex flex-col items-center">
          <GameInfo currentPlayer={currentPlayer} scores={scores} gameOver={gameOver} winner={winner} />
          <Controls onNewGame={handleNewGame} />
        </div>
        <Board board={board} validMoves={validMoves} onCellClick={handleCellClick} currentPlayer={currentPlayer}/>
      </div>
    </div>
  );
};

export default App;
