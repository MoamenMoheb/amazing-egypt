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

    // Parallax & Multi-Layer Setup
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // We create multiple layers that move at different speeds to give a deep 3D slider effect
    const layer1Y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]); // Back layer
    const layer2Y = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]); // Middle layer
    const layer3Y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]); // Front layer

    // Zoom and fade the background deeply into the back
    const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
    const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

    const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
    const opacityContent = useTransform(scrollYProgress, [0, 0.4, 1], [1, 0.6, 0]);

    useEffect(() => {
        const timer = setTimeout(() => setShowCharacter(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div ref={containerRef} className="bg-[#020C1B] font-sans selection:bg-[#FFD700] selection:text-[#0A192F]">
            
            {/* Multi-layered Back Slider */}
            <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden pointer-events-none">
                
                {/* Back Layer (Slowest) */}
                <motion.div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-60"
                    style={{ backgroundImage: `url('/hero-bg.jpeg')`, y: layer1Y, scale: scaleBg, opacity: opacityBg }}
                />

                {/* Middle Gradient Layer (Medium Speed) */}
                <motion.div 
                    className="absolute inset-0 w-full h-full bg-gradient-to-t from-[#020C1B] via-[#0A192F]/50 to-transparent"
                    style={{ y: layer2Y }}
                />

                {/* Front Decorative Layer (Fastest Background Elements) */}
                <motion.div 
                    className="absolute inset-0 w-full h-full"
                    style={{ y: layer3Y }}
                >
                    {/* Glowing orbs (Gold & Dark Blue) */}
                    <div className="absolute top-10 left-1/4 w-60 h-60 bg-yellow-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" />
                    <div className="absolute top-[40%] right-1/4 w-60 h-60 bg-[#1A5276] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
                </motion.div>
            </div>

            {/* Main Content Viewport 1 */}
            <motion.div 
                className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 pb-10 px-4"
                style={{ y: yContent, opacity: opacityContent }}
            >
                <div className="text-center max-w-4xl bg-[#020C1B]/40 p-8 md:p-12 rounded-3xl backdrop-blur-lg border border-[#FFD700]/20 shadow-[0_0_50px_rgba(10,25,47,0.9)]">

                    {/* Title */}
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8, type: 'spring' }} 
                        className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 pb-4 leading-normal sm:leading-relaxed bg-gradient-to-r from-[#FFD700] via-[#F5B041] to-[#FFD700] bg-clip-text text-transparent drop-shadow-lg overflow-visible"
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

                    {/* Enter Museum Button (Moved to top) */}
                    <motion.div className="flex justify-center mt-6">
                        <motion.button
                            onClick={() => navigate('/map')}
                            className="px-12 py-6 bg-gradient-to-r from-[#FFD700] to-[#F39C12] text-[#020C1B] text-xl md:text-2xl font-bold rounded-full shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:shadow-[0_0_50px_rgba(255,215,0,0.8)] transition-all relative overflow-hidden group w-full md:w-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 0.5 }}
                            />
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                خريطة المتحف كاملة
                                <motion.span className="text-3xl" group-hover={{ x: 5 }} transition={{ type: 'spring' }}>🗺️</motion.span>
                            </span>
                        </motion.button>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
                        className="mt-8 flex flex-col items-center justify-center text-[#FFD700]"
                    >
                        <p className="text-sm uppercase tracking-widest mb-2 opacity-80">استكشف الأعماق</p>
                        <motion.div 
                            animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                            className="w-6 h-12 border-2 border-[#FFD700] rounded-full flex justify-center p-1 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                        >
                            <motion.div className="w-1.5 h-3 bg-[#FFD700] rounded-full shadow-[0_0_8px_rgba(255,215,0,1)]" />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Depth Section Viewport 2 */}
            <div id="halls" className="relative z-20 min-h-screen border-t border-[#FFD700]/10 bg-gradient-to-b from-[#020C1B] via-[#010612] to-[#000000] flex flex-col items-center justify-start pt-20 pb-20 px-4 shadow-[0_-20px_50px_rgba(2,12,27,1)]">
                
                {/* Character Slide In */}
                <div className="absolute top-10 left-10 md:left-20 opacity-30 blur-sm mix-blend-luminosity">🏺</div>
                <div className="absolute bottom-20 right-10 md:right-32 opacity-30 blur-sm mix-blend-luminosity">𓂀</div>
                
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center w-full max-w-5xl relative z-10"
                >
                    {showCharacter && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} 
                            className="flex justify-center mb-12"
                        >
                            <div className="relative bg-[#0A192F]/80 p-6 rounded-[50px] backdrop-blur-xl border border-[#FFD700]/30 shadow-[0_0_40px_rgba(255,215,0,0.15)] max-w-sm">
                                <Character inline size={200} mood="waving" message={t('welcomeSub')} />
                            </div>
                        </motion.div>
                    )}

                    {/* Enter Halls Button */}
                    <motion.div className="flex flex-col items-center justify-center gap-6 mb-16 relative z-10 w-full px-4">
                        <motion.button
                            onClick={() => navigate('/halls')}
                            className="w-full md:w-auto px-12 py-6 bg-gradient-to-r from-[#0A192F] to-[#1A5276] text-[#FFD700] text-2xl md:text-3xl font-bold rounded-3xl shadow-[0_0_40px_rgba(26,82,118,0.5)] hover:shadow-[0_0_60px_rgba(255,215,0,0.4)] border border-[#3498DB]/30 hover:border-[#FFD700]/60 transition-all relative overflow-hidden group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'linear', repeatDelay: 1 }}
                            />
                            <span className="relative z-10 flex items-center justify-center gap-4">
                                عرض كل القاعات 
                                <span className="text-4xl group-hover:rotate-12 transition-transform">🏺</span>
                            </span>
                        </motion.button>
                        
                        <p className="text-lg text-[#85C1E9] bg-[#020C1B]/80 px-6 py-2 rounded-full border border-[#1A5276] shadow-md backdrop-blur-sm group-hover:text-[#FFD700] transition-colors">
                            {hallsData.length} قاعات بانتظارك لتستكشفها
                        </p>
                    </motion.div>
                    
                    {/* Stats */}
                    {(badges.length > 0 || score > 0) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap justify-center gap-6"
                        >
                            <div className="bg-[#1A5276]/40 backdrop-blur-md px-6 py-4 rounded-3xl shadow-lg border border-[#FFD700]/20 min-w-[150px]">
                                <p className="text-[#85C1E9] font-bold text-sm uppercase tracking-wider">{t('score')}</p>
                                <p className="text-3xl font-bold text-[#FFD700]">⭐ {score}</p>
                            </div>
                            <div className="bg-[#1A5276]/40 backdrop-blur-md px-6 py-4 rounded-3xl shadow-lg border border-[#FFD700]/20 min-w-[150px]">
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
