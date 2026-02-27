import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import Character from './Character';

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: string;
    options: string[];
    correctIndex: number;
    onCorrect: () => void;
    hallName: string;
}

const QuizModal = ({ isOpen, onClose, question, options, correctIndex, onCorrect, hallName }: QuizModalProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleAnswer = (index: number) => {
        if (selectedIndex !== null) return;
        setSelectedIndex(index);
        const correct = index === correctIndex;
        setIsCorrect(correct);

        if (correct) {
            setShowConfetti(true);
            setTimeout(() => {
                onCorrect();
            }, 2000);
        }
    };

    const handleRetry = () => {
        setSelectedIndex(null);
        setIsCorrect(null);
    };

    const handleClose = () => {
        setSelectedIndex(null);
        setIsCorrect(null);
        setShowConfetti(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                    onClick={handleClose}
                >
                    <Confetti show={showConfetti} />

                    <motion.div
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-5 text-white">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl">🧩</span>
                                <div>
                                    <h2 className="text-2xl font-bold">Quiz Time!</h2>
                                    <p className="text-purple-100 text-sm">{hallName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Character reaction */}
                            <div className="flex justify-center mb-4">
                                <Character
                                    inline
                                    size={80}
                                    mood={isCorrect === true ? 'excited' : isCorrect === false ? 'thinking' : 'happy'}
                                    message={
                                        isCorrect === true
                                            ? 'Amazing! You got it right! 🎉'
                                            : isCorrect === false
                                                ? "Oops! Let's try again! 💪"
                                                : undefined
                                    }
                                    onCelebrate={isCorrect === true}
                                />
                            </div>

                            {/* Question */}
                            <p className="text-xl font-bold text-gray-800 text-center mb-6">{question}</p>

                            {/* Options */}
                            <div className="grid gap-3">
                                {options.map((option, i) => {
                                    let bgClass = 'bg-gray-50 hover:bg-amber-50 border-gray-200 hover:border-amber-400';
                                    if (selectedIndex !== null) {
                                        if (i === correctIndex) {
                                            bgClass = 'bg-green-100 border-green-500';
                                        } else if (i === selectedIndex && !isCorrect) {
                                            bgClass = 'bg-red-100 border-red-400';
                                        } else {
                                            bgClass = 'bg-gray-50 border-gray-200 opacity-50';
                                        }
                                    }

                                    return (
                                        <motion.button
                                            key={i}
                                            whileHover={selectedIndex === null ? { scale: 1.02 } : {}}
                                            whileTap={selectedIndex === null ? { scale: 0.98 } : {}}
                                            onClick={() => handleAnswer(i)}
                                            className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-bold text-gray-800 transition-all ${bgClass}`}
                                            disabled={selectedIndex !== null}
                                        >
                                            <span className="text-amber-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                                            {option}
                                            {selectedIndex !== null && i === correctIndex && (
                                                <span className="ml-2">✅</span>
                                            )}
                                            {selectedIndex === i && !isCorrect && (
                                                <span className="ml-2">❌</span>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-center gap-3">
                                {isCorrect === false && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={handleRetry}
                                        className="px-6 py-3 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-colors shadow-md"
                                    >
                                        Try Again! 🔄
                                    </motion.button>
                                )}
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuizModal;
