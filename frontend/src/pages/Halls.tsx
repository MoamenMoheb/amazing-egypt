import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { hallsData } from '../data/halls';
import { useMuseum } from '../context/MuseumContext';

const Halls = () => {
    const navigate = useNavigate();
    const { badges, score } = useMuseum();

    return (
        <div className="min-h-screen bg-transparent font-sans selection:bg-[#FFD700] selection:text-[#0A192F] pt-0 pb-20 px-4 relative overflow-hidden">
            
            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-10 left-1/4 w-60 h-60 bg-yellow-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-[#1A5276] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#FFD700] to-[orange] bg-clip-text text-transparent drop-shadow-md mb-6 inline-flex items-center gap-4">
                        <span className="text-4xl md:text-5xl drop-shadow-none">🏛️</span>
                        قاعات المتحف
                        <span className="text-4xl md:text-5xl drop-shadow-none">🏺</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#E5E7EB] max-w-2xl mx-auto font-medium leading-relaxed shadow-sm">
                        اختر قاعة لتبدأ استكشاف القطع الأثرية المذهلة الخاصة بها
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" dir="rtl">
                    {hallsData.map((hall, index) => (
                        <motion.div
                            key={hall.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            onClick={() => navigate(`/hall/${hall.id}`)}
                            className="group relative bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-[#FFD700]/20 cursor-pointer overflow-hidden hover:shadow-[0_0_30px_rgba(255,215,0,0.25)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Hover background glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg bg-gradient-to-br ${hall.gradient} overflow-hidden`}>
                                        {hall.image ? (
                                            <img src={hall.image} alt={hall.nameAr} className="w-full h-full object-cover" />
                                        ) : (
                                            hall.icon
                                        )}
                                    </div>
                                    <div className="text-sm font-bold px-3 py-1 rounded-full bg-[#020C1B]/80 text-[#FFD700] border border-[#FFD700]/30 flex items-center gap-2">
                                        <span className="text-lg">🏺</span> 
                                        {hall.artifactIds.length} قطع
                                    </div>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-[#FFD700] mb-3 group-hover:text-white transition-colors">
                                    {hall.nameAr}
                                </h3>
                                
                                <p className="text-[#E5E7EB] text-base leading-relaxed mb-6 flex-grow">
                                    {hall.descriptionAr}
                                </p>
                                
                                <div className="mt-auto w-full flex items-center text-[#F39C12] font-bold group-hover:text-[#FFD700] transition-colors border-t border-[#1A5276] pt-4">
                                    <span>استكشاف القاعة</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-auto transform rotate-180 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Score Summary */}
                {(badges.length > 0 || score > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 flex flex-wrap justify-center gap-6"
                    >
                        <div className="bg-[#1A5276]/40 backdrop-blur-md px-8 py-5 rounded-3xl shadow-lg border border-[#FFD700]/30 min-w-[160px] text-center">
                            <p className="text-[#85C1E9] font-bold text-sm uppercase tracking-wider mb-1">النقاط</p>
                            <p className="text-4xl font-bold text-[#FFD700]">⭐ {score}</p>
                        </div>
                        <div className="bg-[#1A5276]/40 backdrop-blur-md px-8 py-5 rounded-3xl shadow-lg border border-[#FFD700]/30 min-w-[160px] text-center">
                            <p className="text-[#85C1E9] font-bold text-sm uppercase tracking-wider mb-1">شاراتك</p>
                            <p className="text-4xl font-bold text-[#FFD700]">🏅 {badges.length}/{hallsData.length}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Halls;
