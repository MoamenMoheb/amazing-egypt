import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Character from '../components/Character';
import BadgeProgress from '../components/BadgeProgress';
import BadgeDisplay from '../components/BadgeDisplay';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showCharacter, setShowCharacter] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowCharacter(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-transparent font-sans selection:bg-[#FFD700] selection:text-[#0A192F] pt-24 pb-20 relative overflow-x-hidden">

            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#1A5276]/30 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFD700]/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center">

                {/* Hero Title Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: 'spring' }}
                    className="mb-6 flex justify-center w-full"
                >
                    <img 
                        src="/N Logo.png" 
                        alt={t('title')} 
                        className="h-40 sm:h-56 md:h-64 lg:h-72 w-auto max-w-full object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:drop-shadow-[0_0_35px_rgba(255,215,0,0.6)] transition-all duration-300 transform hover:scale-105" 
                    />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[#85C1E9] text-lg md:text-xl font-medium mb-10 text-center"
                >
                    {t('welcome')}
                </motion.p>

                {/* Mascot Hero Section */}
                {showCharacter && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                        className="flex flex-col items-center relative z-20"
                    >
                        <div className="relative bg-[#020C1B]/60 p-8 rounded-[60px] backdrop-blur-md border border-[#FFD700]/30 shadow-[0_0_60px_rgba(255,215,0,0.15)] flex justify-center w-full max-w-md">
                            <Character
                                inline
                                size={280}
                                mood="pointing"
                                message="Welcome explorer! Visit the museum halls and complete quizzes to earn badges!"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Gamified Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="w-full relative z-30 -mt-6"
                >
                    <BadgeProgress />
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col sm:flex-row gap-6 mt-12 mb-16 relative z-10"
                >
                    <motion.button
                        onClick={() => navigate('/halls')}
                        className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[orange] text-[#0A192F] text-xl font-bold rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_35px_rgba(255,215,0,0.6)] border border-white/20 transition-all flex items-center justify-center gap-3"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>🏛️</span> Explore Halls
                    </motion.button>
                    <motion.button
                        onClick={() => navigate('/map')}
                        className="px-8 py-4 bg-[#0A192F] text-[#FFD700] text-xl font-bold rounded-full shadow-[0_0_20px_rgba(10,25,47,0.5)] border border-[#FFD700]/50 hover:bg-[#1A5276] hover:border-[#FFD700] transition-all flex items-center justify-center gap-3"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>🗺️</span> View Map
                    </motion.button>
                </motion.div>

                {/* Badge Grid Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="w-full relative z-10 bg-[#0A192F]/50 backdrop-blur-sm border border-[#3498DB]/20 rounded-3xl p-8"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-4xl">🏅</span>
                        <h2 className="text-3xl font-bold text-[#FFD700] drop-shadow-sm">Your Badge Collection</h2>
                    </div>

                    <BadgeDisplay />
                </motion.div>

            </div>
        </div>
    );
};

export default Home;
