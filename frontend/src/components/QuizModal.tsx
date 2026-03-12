import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import { useMascot } from '../context/MascotContext';

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
    const { triggerReaction } = useMascot();

    const handleAnswer = (index: number) => {
        if (selectedIndex !== null) return;
        setSelectedIndex(index);
        const correct = index === correctIndex;
        setIsCorrect(correct);

        if (correct) {
            triggerReaction('celebration', 'Amazing! You got it right! 🎉', 4000);
            setShowConfetti(true);
            setTimeout(() => {
                onCorrect();
            }, 2000);
        } else {
            triggerReaction('confused', "Oops! Let's try again! 💪", 3000);
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
                        className="bg-[#020C1B] border border-[#FFD700]/30 rounded-3xl shadow-[0_0_50px_rgba(10,25,47,0.9)] max-w-lg w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#0A192F] to-[#1A5276] border-b border-[#FFD700]/20 px-6 py-5 text-[#E5E7EB]">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl">🧩</span>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#FFD700]">Quiz Time!</h2>
                                    <p className="text-[#85C1E9] text-sm">{hallName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Question */}
                            <p className="text-xl font-bold text-[#FFD700] text-center mb-6">{question}</p>

                            {/* Options */}
                            <div className="grid gap-3">
                                {options.map((option, i) => {
                                    let bgClass = 'bg-[#0A192F] hover:bg-[#1A5276]/60 border-[#1A5276] hover:border-[#FFD700] text-[#E5E7EB]';
                                    if (selectedIndex !== null) {
                                        if (i === correctIndex) {
                                            bgClass = 'bg-[#145A32] border-[#2ECC71] text-white';
                                        } else if (i === selectedIndex && !isCorrect) {
                                            bgClass = 'bg-[#7B241C] border-[#E74C3C] text-white';
                                        } else {
                                            bgClass = 'bg-[#0A192F] border-[#1A5276] text-[#E5E7EB] opacity-50';
                                        }
                                    }

                                    return (
                                        <motion.button
                                            key={i}
                                            whileHover={selectedIndex === null ? { scale: 1.02 } : {}}
                                            whileTap={selectedIndex === null ? { scale: 0.98 } : {}}
                                            onClick={() => handleAnswer(i)}
                                            className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-bold transition-all ${bgClass}`}
                                            disabled={selectedIndex !== null}
                                        >
                                            <span className="text-[#FFD700] mr-2">{String.fromCharCode(65 + i)}.</span>
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
                                        className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#F39C12] text-[#0A192F] font-bold rounded-full hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all"
                                    >
                                        Try Again! 🔄
                                    </motion.button>
                                )}
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-3 bg-[#0A192F] text-[#85C1E9] border border-[#1A5276] font-bold rounded-full hover:bg-[#1A5276] hover:text-white transition-colors"
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
