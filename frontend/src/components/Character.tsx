import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Character = () => {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Initial greeting
        setTimeout(() => {
            setMessage(t('welcome', 'Welcome!'));
        }, 1000);

        // Clear greeting
        setTimeout(() => {
            setMessage('');
        }, 4000);
    }, [t]);

    const handleClick = () => {
        setMessage(t('explore', 'Let\'s explore!'));
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="bg-white p-4 rounded-t-2xl rounded-bl-2xl shadow-lg border-2 border-brand-primary mb-2 max-w-xs text-brand-dark font-bold relative"
                    >
                        {message}
                        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b-2 border-r-2 border-brand-primary transform rotate-45"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                animate={{
                    y: [0, -10, 0],
                    rotate: isHovered ? [0, -5, 5, 0] : 0
                }}
                transition={{
                    y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    rotate: { duration: 0.5 }
                }}
            >
                {/* Simple Pharaoh SVG Character */}
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Headpiece */}
                    <path d="M20 30C20 30 30 10 50 10C70 10 80 30 80 30V50C80 70 70 80 50 80C30 80 20 70 20 50V30Z" fill="#F4D03F" />
                    <path d="M20 30H80V40H20V30Z" fill="#1A5276" />

                    {/* Face */}
                    <circle cx="50" cy="50" r="25" fill="#F5CBA7" />

                    {/* Eyes */}
                    <circle cx="42" cy="45" r="3" fill="#2C3E50">
                        {/* Blink animation could go here */}
                    </circle>
                    <circle cx="58" cy="45" r="3" fill="#2C3E50" />

                    {/* Smile */}
                    <path d="M42 55Q50 60 58 55" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />

                    {/* Beard */}
                    <rect x="47" y="73" width="6" height="10" rx="2" fill="#1A5276" />
                </svg>
            </motion.div>
        </div>
    );
};

export default Character;
