import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface MinesweeperProps {
    onGameEnd?: (result: 'Win' | 'Loss') => void;
}

interface Cell {
    x: number;
    y: number;
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborMines: number;
}

const BOARD_SIZE = 9;
const NUM_MINES = 10;

const Minesweeper = ({ onGameEnd }: MinesweeperProps) => {
    const [board, setBoard] = useState<Cell[][]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        const newBoard: Cell[][] = [];
        for (let y = 0; y < BOARD_SIZE; y++) {
            const row: Cell[] = [];
            for (let x = 0; x < BOARD_SIZE; x++) {
                row.push({
                    x,
                    y,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0,
                });
            }
            newBoard.push(row);
        }

        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < NUM_MINES) {
            const x = Math.floor(Math.random() * BOARD_SIZE);
            const y = Math.floor(Math.random() * BOARD_SIZE);
            if (!newBoard[y][x].isMine) {
                newBoard[y][x].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate neighbors
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                if (!newBoard[y][x].isMine) {
                    let neighbors = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const ny = y + dy;
                            const nx = x + dx;
                            if (ny >= 0 && ny < BOARD_SIZE && nx >= 0 && nx < BOARD_SIZE && newBoard[ny][nx].isMine) {
                                neighbors++;
                            }
                        }
                    }
                    newBoard[y][x].neighborMines = neighbors;
                }
            }
        }

        setBoard(newBoard);
        setGameOver(false);
        setGameWon(false);
    };

    const revealCell = (x: number, y: number) => {
        if (gameOver || board[y][x].isFlagged || board[y][x].isRevealed) return;

        const newBoard = [...board];
        const cell = newBoard[y][x];

        if (cell.isMine) {
            cell.isRevealed = true;
            setBoard(newBoard);
            setGameOver(true);
            if (onGameEnd) onGameEnd('Loss');
            return;
        }

        const revealRecursive = (cx: number, cy: number) => {
            if (cx < 0 || cx >= BOARD_SIZE || cy < 0 || cy >= BOARD_SIZE || newBoard[cy][cx].isRevealed || newBoard[cy][cx].isFlagged) return;

            newBoard[cy][cx].isRevealed = true;

            if (newBoard[cy][cx].neighborMines === 0) {
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        revealRecursive(cx + dx, cy + dy);
                    }
                }
            }
        };

        revealRecursive(x, y);
        setBoard(newBoard);
        checkWin(newBoard);
    };

    const toggleFlag = (e: React.MouseEvent, x: number, y: number) => {
        e.preventDefault();
        if (gameOver || board[y][x].isRevealed) return;

        const newBoard = [...board];
        newBoard[y][x].isFlagged = !newBoard[y][x].isFlagged;
        setBoard(newBoard);
    };

    const checkWin = (currentBoard: Cell[][]) => {
        let revealedCount = 0;
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                if (currentBoard[y][x].isRevealed) {
                    revealedCount++;
                }
            }
        }
        if (revealedCount === BOARD_SIZE * BOARD_SIZE - NUM_MINES) {
            setGameWon(true);
            setGameOver(true);
            if (onGameEnd) onGameEnd('Win');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-[#FDF5E6] rounded-xl border-4 border-[#CDA434] shadow-2xl max-w-md mx-auto font-serif">
            <h2 className="text-3xl font-bold text-[#CDA434] mb-4 drop-shadow-sm uppercase tracking-widest">
                Scarab Sweep
            </h2>

            <div className="mb-4 flex justify-between w-full px-4 text-[#8B4513] font-bold">
                <span>💣 {NUM_MINES - board.flat().filter(c => c.isFlagged).length}</span>
                <span>{gameOver ? (gameWon ? '🏆 VICTORY' : '💀 DEFEAT') : 'Playing...'}</span>
            </div>

            <div className="grid grid-cols-9 gap-1 bg-[#E8C586] p-2 rounded-lg border-2 border-[#8B4513]">
                {board.map((row, y) => (
                    row.map((cell, x) => (
                        <button
                            key={`${x}-${y}`}
                            onClick={() => revealCell(x, y)}
                            onContextMenu={(e) => toggleFlag(e, x, y)}
                            className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded transition-all duration-200 ${cell.isRevealed
                                ? cell.isMine
                                    ? 'bg-red-500 border-red-700'
                                    : 'bg-[#FDF5E6] border-[#E8C586]'
                                : 'bg-[#D2B48C] hover:bg-[#C19A6B] border-[#8B4513] border-b-4 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-1'
                                }`}
                        >
                            {cell.isRevealed ? (
                                cell.isMine ? '🦂' : cell.neighborMines > 0 ? cell.neighborMines : ''
                            ) : cell.isFlagged ? (
                                <span className="text-red-600">🚩</span>
                            ) : (
                                ''
                            )}
                        </button>
                    ))
                ))}
            </div>

            <button
                onClick={initGame}
                className="mt-6 p-2 rounded-full bg-[#CDA434] text-white hover:bg-[#B8860B] transition-colors shadow-lg"
                title="Reset Game"
            >
                <RefreshCw size={24} />
            </button>
        </div>
    );
};

export default Minesweeper;
