import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MascotGuide = () => {
    const [showMessage, setShowMessage] = useState(true);

    return (
        <div className="fixed bottom-5 right-9
         z-[100] flex flex-col items-end pointer-events-none">
            {/* Speech Bubble */}
            <AnimatePresence>
                {showMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="bg-white text-gray-800 p-4 rounded-2xl shadow-xl mb-3 max-w-[250px] relative pointer-events-auto cursor-pointer"
                        style={{ borderBottomRightRadius: '4px' }}
                        onClick={() => setShowMessage(false)}
                    >
                        <p className="text-sm font-medium leading-snug">
                            Welcome explorer! Visit the museum halls and complete quizzes to earn badges!
                        </p>
                        {/* Tail */}
                        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mascot Image */}
            <motion.div
                className="relative w-[120px] h-[120px] pointer-events-auto cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMessage(!showMessage)}
            >
                {/* Floating animation container */}
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-full"
                >
                    <img
                        src="/character/New-Mascot1.png"
                        alt="Museum Mascot"
                        className="w-full h-full object-contain filter drop-shadow-lg"
                        draggable={false}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default MascotGuide;
