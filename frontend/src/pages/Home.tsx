import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Character from '../components/Character';
import BadgeProgress from '../components/BadgeProgress';
import BadgeDisplay from '../components/BadgeDisplay';

const Home = () => {
    const navigate = useNavigate();
    const [showCharacter, setShowCharacter] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowCharacter(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-transparent font-sans selection:bg-[#FFD700] selection:text-[#0A192F] pt-4 pb-20 relative overflow-x-hidden">

            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#1A5276]/30 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFD700]/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center">
                
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-1"
                >
                    <img 
                        src="/images/logo.png" 
                        alt="Amazing Egypt Logo" 
                        className="h-32 md:h-40 w-auto object-contain drop-shadow-xl"
                    />
                </motion.div>

                {/* Mascot Hero Section */}
                {showCharacter && (
                    <div className="flex flex-col items-center relative mt-0">
                        <div className="flex justify-center w-full max-w-4xl mx-auto relative">
                            <Character
                                playIntroVideo={true}
                                inline
                                size={320}
                                mood="speaking"
                                message="اهلا بك ايها المستكشف انا اسمي چيمو , ساكون معك خلال رحلتك الاستكشافية ... هيا بنا لنبدأ المغامرة "
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 mt-1 mb-2 relative z-10"
                >
                    <motion.button
                        onClick={() => navigate('/map')}
                        className="px-10 py-2.5 bg-[#0A192F] text-[#FFD700] text-lg font-bold rounded-full shadow-[0_0_20px_rgba(10,25,47,0.5)] border border-[#FFD700]/50 hover:bg-[#1A5276] hover:border-[#FFD700] transition-all flex items-center justify-center gap-3"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>🗺️</span> عرض الخريطة
                    </motion.button>
                </motion.div>

                {/* Gamified Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="w-full max-w-2xl relative z-30 mb-8"
                >
                    <BadgeProgress />
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
                        <h2 className="text-3xl font-bold text-[#FFD700] drop-shadow-sm">مجموعة شاراتك</h2>
                    </div>

                    <BadgeDisplay />
                </motion.div>

            </div>
        </div>
    );
};

export default Home;
