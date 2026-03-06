import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import Character from '../components/Character';
import { useMuseum } from '../context/MuseumContext';
import { hallsData } from '../data/halls';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { badges, score } = useMuseum();
    const [showCharacter, setShowCharacter] = useState(false);

    // 3D Parallax Depth Setup
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Transforms for parallax
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
    const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
    const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const opacityContent = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

    useEffect(() => {
        const timer = setTimeout(() => setShowCharacter(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div ref={containerRef} className="bg-[#020C1B] font-sans selection:bg-[#FFD700] selection:text-[#0A192F]">

            {/* Parallax Background with 3D Depth */}
            <motion.div
                className="fixed inset-0 z-0 h-screen w-full overflow-hidden pointer-events-none"
                style={{ y: yBg, scale: scaleBg, opacity: opacityBg }}
            >
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('/hero-bg.jpeg')` }}
                />
                {/* Gradient overlay to blend with dark blue */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A192F]/80 to-[#020C1B]" />
            </motion.div>

            {/* Glowing orbs (Gold & Dark Blue Theme) */}
            <div className="fixed top-10 left-1/4 w-40 h-40 bg-yellow-400 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none animate-pulse" />
            <div className="fixed top-20 right-1/4 w-40 h-40 bg-[#1A5276] rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="fixed bottom-20 left-1/3 w-40 h-40 bg-[#0A192F] rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none animate-pulse" style={{ animationDelay: '4s' }} />

            {/* Floating decorations */}
            <motion.div className="fixed top-20 left-10 text-5xl opacity-40 mix-blend-luminosity z-0" animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6 }}>🏺</motion.div>
            <motion.div className="fixed top-32 right-16 text-4xl opacity-40 mix-blend-luminosity z-0" animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }}>👑</motion.div>
            <motion.div className="fixed bottom-20 left-20 text-4xl opacity-40 mix-blend-luminosity z-0" animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 7, delay: 2 }}>🔺</motion.div>
            <motion.div className="fixed bottom-32 right-20 text-5xl opacity-40 mix-blend-luminosity z-0" animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}>🌴</motion.div>
            <motion.div className="fixed top-1/2 left-8 text-3xl opacity-30 z-0 text-[#FFD700]" animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 5.5, delay: 3 }}>𓂀</motion.div>
            <motion.div className="fixed top-1/3 right-8 text-3xl opacity-30 z-0 text-[#FFD700]" animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, delay: 1.5 }}>𓃭</motion.div>

            {/* Main Content Viewport 1 */}
            <motion.div
                className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 pb-10 px-4"
                style={{ y: yContent, opacity: opacityContent }}
            >
                <div className="text-center max-w-4xl bg-[#020C1B]/60 p-8 md:p-12 rounded-3xl backdrop-blur-md border border-[#1A5276]/50 shadow-[0_0_40px_rgba(10,25,47,0.8)]">
                    {/* Museum Building Silhouette */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-6">
                        <div className="text-8xl md:text-9xl drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">🏛️</div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 pb-4 leading-normal sm:leading-relaxed bg-gradient-to-r from-[#FFD700] via-[#F5B041] to-[#FFD700] bg-clip-text text-transparent drop-shadow-md overflow-visible"
                    >
                        {t('title')}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-xl md:text-3xl text-[#F8F9FA] mb-8 font-medium drop-shadow"
                    >
                        {t('welcome')}
                    </motion.p>

                    {/* Character greeting */}
                    {showCharacter && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.7 }}
                            className="flex justify-center mb-8 bg-white/10 p-4 rounded-3xl backdrop-blur-sm"
                        >
                            <Character inline size={280} mood="waving" message={t('welcomeSub')} />
                        </motion.div>
                    )}

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
                        className="mt-8 flex flex-col items-center justify-center text-[#FFD700]"
                    >
                        <p className="text-sm uppercase tracking-widest mb-2 opacity-80">Scroll to Explore</p>
                        <motion.div
                            animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-6 h-10 border-2 border-[#FFD700] rounded-full flex justify-center p-1"
                        >
                            <motion.div className="w-1 h-2 bg-[#FFD700] rounded-full" />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Depth Section Viewport 2 */}
            <div className="relative z-20 min-h-screen bg-gradient-to-b from-transparent via-[#020C1B] to-[#010612] flex flex-col items-center justify-center pt-20 pb-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-[#FFD700] to-[orange] bg-clip-text text-transparent">
                        Discover Ancient Wonders
                    </h2>
                    <p className="text-xl md:text-2xl text-[#E5E7EB] mb-12 leading-relaxed">
                        Journey through time and experience the magnificence of Egyptian history.
                        Step into a stunning 3D interactive exhibition where the artifacts come alive.
                    </p>

                    {/* Enter Museum Button */}
                    <motion.div>
                        <motion.button
                            onClick={() => navigate('/map')}
                            className="px-12 py-6 bg-gradient-to-r from-[#FFD700] to-[#F39C12] text-[#020C1B] text-2xl font-bold rounded-full shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:shadow-[0_0_50px_rgba(255,215,0,0.8)] transition-all relative overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            id="enter-museum-btn"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 0.5 }}
                            />
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {t('enterMuseum')}
                                <span className="text-3xl">🧭</span>
                            </span>
                        </motion.button>
                    </motion.div>

                    {/* Stats */}
                    {(badges.length > 0 || score > 0) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="mt-16 flex justify-center gap-6"
                        >
                            <div className="bg-[#1A5276]/40 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-[#3498DB]/30">
                                <p className="text-[#85C1E9] font-bold text-sm uppercase tracking-wider">{t('score')}</p>
                                <p className="text-3xl font-bold text-[#FFD700]">⭐ {score}</p>
                            </div>
                            <div className="bg-[#1A5276]/40 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-[#3498DB]/30">
                                <p className="text-[#85C1E9] font-bold text-sm uppercase tracking-wider">{t('yourBadges')}</p>
                                <p className="text-3xl font-bold text-[#FFD700]">🏅 {badges.length}/{hallsData.length}</p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
