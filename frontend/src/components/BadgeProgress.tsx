import { motion } from 'framer-motion';
import { useMuseum } from '../context/MuseumContext';
import { hallsData } from '../data/halls';

const BadgeProgress = () => {
    const { badges } = useMuseum();

    const totalBadges = hallsData.length;
    const earnedBadgesCount = badges.length;
    const progressPercentage = (earnedBadgesCount / totalBadges) * 100;

    return (
        <div className="w-full max-w-3xl mx-auto px-4 mt-8">
            <div className="bg-[#1A5276]/30 backdrop-blur-md border border-[#3498DB]/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(26,82,118,0.4)]">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-[#FFD700] mb-1">
                            {earnedBadgesCount === 0
                                ? "Start Your Adventure!"
                                : earnedBadgesCount === totalBadges
                                    ? "Museum Master! 🏆"
                                    : "Keep Exploring!"}
                        </h3>
                        <p className="text-[#85C1E9] font-medium text-sm md:text-base">
                            You've earned <span className="text-white font-bold">{earnedBadgesCount}</span> out of <span className="text-white font-bold">{totalBadges}</span> badges!
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                            {Math.round(progressPercentage)}%
                        </span>
                    </div>
                </div>

                {/* Progress Bar Track */}
                <div className="relative h-6 w-full bg-[#020C1B] rounded-full overflow-hidden border border-[#0A192F] shadow-inner">
                    {/* Progress Fill */}
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F39C12] to-[#FFD700] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", type: "spring", bounce: 0.2 }}
                    />

                    {/* Shimmer Effect */}
                    <motion.div
                        className="absolute top-0 left-0 h-full w-[20%] bg-white/30 rounded-full mix-blend-overlay"
                        animate={{ x: ['-100%', '500%'] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    />
                </div>

                {/* Sparkles for completion */}
                {earnedBadgesCount === totalBadges && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-4 -right-4 text-4xl"
                    >
                        ✨
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BadgeProgress;
