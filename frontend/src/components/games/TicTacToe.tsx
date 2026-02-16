import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

type Player = 'X' | 'O';
type SquareValue = Player | null;

interface TicTacToeProps {
    onGameEnd?: (winner: Player | 'Draw') => void;
}

const TicTacToe = ({ onGameEnd }: TicTacToeProps) => {
    const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState<Player | 'Draw' | null>(null);

    const calculateWinner = (squares: SquareValue[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a] as Player;
            }
        }
        return null;
    };

    const handleClick = (i: number) => {
        if (squares[i] || winner) return;
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    };

    useEffect(() => {
        const win = calculateWinner(squares);
        if (win) {
            setWinner(win);
            if (onGameEnd) onGameEnd(win);
        } else if (!squares.includes(null)) {
            setWinner('Draw');
            if (onGameEnd) onGameEnd('Draw');
        }
    }, [squares, onGameEnd]);

    const resetGame = () => {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
        setWinner(null);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-[#FDF5E6] rounded-xl border-4 border-[#CDA434] shadow-2xl max-w-sm mx-auto font-serif">
            <h2 className="text-3xl font-bold text-[#CDA434] mb-6 drop-shadow-sm uppercase tracking-widest">
                Dueling Deities
            </h2>

            <div className="grid grid-cols-3 gap-3 mb-6 bg-[#E8C586] p-3 rounded-lg border-2 border-[#8B4513]">
                {squares.map((value, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i)}
                        disabled={!!value || !!winner}
                        className={`w-20 h-20 text-5xl font-bold flex items-center justify-center rounded bg-[#FDF5E6] border-2 border-[#CDA434] shadow-md transition-all hover:bg-[#FFF8F0] ${value === 'X' ? 'text-[#8B0000]' : 'text-[#00008B]'
                            }`}
                    >
                        {value === 'X' ? '☥' : value === 'O' ? '𓂀' : ''}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between w-full px-4">
                <div className="text-xl font-bold text-[#8B4513]">
                    {winner
                        ? winner === 'Draw' ? 'Stalemate!' : `${winner === 'X' ? '☥' : '𓂀'} Wins!`
                        : `Turn: ${xIsNext ? '☥' : '𓂀'}`}
                </div>
                <button
                    onClick={resetGame}
                    className="p-2 rounded-full bg-[#CDA434] text-white hover:bg-[#B8860B] transition-colors shadow-lg"
                    title="Reset Game"
                >
                    <RefreshCw size={24} />
                </button>
            </div>
        </div>
    );
};

export default TicTacToe;
