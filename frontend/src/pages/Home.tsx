import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Character from '../components/Character';
import { useMuseum } from '../context/MuseumContext';
import { hallsData } from '../data/halls';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { badges, score } = useMuseum();
    const [showCharacter, setShowCharacter] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowCharacter(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex flex-col items-center justify-center font-sans overflow-hidden relative pt-20 pb-10 px-4">
            {/* Floating decorations */}
            <motion.div
                className="absolute top-20 left-10 text-5xl opacity-20"
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 6 }}
            >
                🏺
            </motion.div>
            <motion.div
                className="absolute top-32 right-16 text-4xl opacity-20"
                animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
            >
                👑
            </motion.div>
            <motion.div
                className="absolute bottom-20 left-20 text-4xl opacity-20"
                animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 7, delay: 2 }}
            >
                🔺
            </motion.div>
            <motion.div
                className="absolute bottom-32 right-20 text-5xl opacity-20"
                animate={{ y: [0, -18, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
            >
                🌴
            </motion.div>
            <motion.div
                className="absolute top-1/2 left-8 text-3xl opacity-15"
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 5.5, delay: 3 }}
            >
                𓂀
            </motion.div>
            <motion.div
                className="absolute top-1/3 right-8 text-3xl opacity-15"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 6, delay: 1.5 }}
            >
                𓃭
            </motion.div>

            {/* Glowing orbs */}
            <div className="absolute top-10 left-1/4 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute top-20 right-1/4 w-40 h-40 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />

            {/* Main Content */}
            <div className="z-10 text-center max-w-2xl">
                {/* Museum Building Silhouette */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6"
                >
                    <div className="text-8xl md:text-9xl">🏛️</div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm"
                >
                    {t('title')}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl md:text-2xl text-amber-700 mb-8 font-medium"
                >
                    {t('welcome')}
                </motion.p>

                {/* Character greeting */}
                {showCharacter && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.7 }}
                        className="flex justify-center mb-8"
                    >
                        <Character
                            inline
                            size={280}
                            mood="waving"
                            message={t('welcomeSub')}
                        />
                    </motion.div>
                )}

                {/* Enter Museum Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    <motion.button
                        onClick={() => navigate('/map')}
                        className="px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-2xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
                        whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(245, 158, 11, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        id="enter-museum-btn"
                    >
                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'linear', repeatDelay: 1 }}
                        />
                        <span className="relative z-10">{t('enterMuseum')}</span>
                    </motion.button>
                </motion.div>

                {/* Stats */}
                {(badges.length > 0 || score > 0) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="mt-8 flex justify-center gap-6"
                    >
                        <div className="bg-white/70 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-md border border-amber-200">
                            <p className="text-amber-800 font-bold text-sm">{t('score')}</p>
                            <p className="text-2xl font-bold text-amber-600">⭐ {score}</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-md border border-amber-200">
                            <p className="text-amber-800 font-bold text-sm">{t('yourBadges')}</p>
                            <p className="text-2xl font-bold text-amber-600">🏅 {badges.length}/{hallsData.length}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;
