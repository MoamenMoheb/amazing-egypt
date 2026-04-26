import { motion } from 'framer-motion';
import { useMuseum } from '../context/MuseumContext';
import { hallsData } from '../data/halls';
import { artifactsData } from '../data/artifacts';

const BadgeProgress = () => {
    const { badges, viewedArtifacts } = useMuseum();

    const totalBadges = hallsData.length;
    const earnedBadgesCount = badges.length;

    // Track overall artifact exploration progress
    const totalArtifacts = artifactsData.length;
    const viewedCount = viewedArtifacts.length;
    const explorationPercentage = totalArtifacts > 0 ? (viewedCount / totalArtifacts) * 100 : 0;

    // Determine the label
    const getLabel = () => {
        if (earnedBadgesCount === totalBadges) return "Museum Master! 🏆";
        if (viewedCount === 0) return "ابدأ مغامرتك";
        if (explorationPercentage >= 75) return "أنت مستكشف رائع! 🌟";
        if (explorationPercentage >= 50) return "رائع! استمر في الاستكشاف 💪";
        if (explorationPercentage >= 25) return "بداية موفقة! 🔥";
        return "Keep Exploring!";
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 mt-8">
            <div className="bg-[#1A5276]/30 backdrop-blur-md border border-[#3498DB]/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(26,82,118,0.4)]">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-[#FFD700] mb-1">
                            {getLabel()}
                        </h3>
                        <p className="text-[#85C1E9] font-medium text-sm md:text-base" dir="rtl">
                            استكشفت <span className="text-white font-bold">{viewedCount}</span> من أصل <span className="text-white font-bold">{totalArtifacts}</span> قطعة أثرية
                            {earnedBadgesCount > 0 && (
                                <span> · <span className="text-[#FFD700] font-bold">{earnedBadgesCount}</span> شارات 🏅</span>
                            )}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                            {Math.round(explorationPercentage)}%
                        </span>
                    </div>
                </div>

                {/* Progress Bar Track */}
                <div className="relative h-6 w-full bg-[#020C1B] rounded-full overflow-hidden border border-[#0A192F] shadow-inner">
                    {/* Progress Fill */}
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F39C12] to-[#FFD700] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${explorationPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", type: "spring", bounce: 0.2 }}
                    />

                    {/* Badge milestone markers */}
                    {hallsData.map((hall, i) => {
                        // Place a marker at each hall's artifact completion threshold
                        const hallEndIndex = hallsData.slice(0, i + 1).reduce((sum, h) => sum + h.artifactIds.length, 0);
                        const markerPos = (hallEndIndex / totalArtifacts) * 100;
                        const isComplete = badges.includes(hall.badge.id);
                        
                        return (
                            <div
                                key={hall.id}
                                className="absolute top-0 h-full flex items-center"
                                style={{ left: `${markerPos}%`, transform: 'translateX(-50%)' }}
                            >
                                <div
                                    className={`w-1 h-full ${isComplete ? 'bg-green-400/60' : 'bg-white/20'}`}
                                />
                            </div>
                        );
                    })}

                    {/* Shimmer Effect */}
                    <motion.div
                        className="absolute top-0 left-0 h-full w-[20%] bg-white/30 rounded-full mix-blend-overlay"
                        animate={{ x: ['-100%', '500%'] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    />
                </div>

                {/* Hall completion mini badges */}
                <div className="flex justify-between mt-3 px-1">
                    {hallsData
                        .sort((a, b) => a.unlockOrder - b.unlockOrder)
                        .map((hall) => {
                        const isComplete = badges.includes(hall.badge.id);
                        const hallArtifacts = hall.artifactIds;
                        const viewedInHall = hallArtifacts.filter(id => viewedArtifacts.includes(id)).length;

                        return (
                            <div key={hall.id} className="flex flex-col items-center gap-1">
                                <span className={`text-lg ${isComplete ? '' : 'grayscale opacity-40'}`}>
                                    {isComplete ? hall.badge.icon : '🔒'}
                                </span>
                                <span className={`text-[9px] font-bold ${isComplete ? 'text-green-400' : 'text-gray-500'}`}>
                                    {viewedInHall}/{hallArtifacts.length}
                                </span>
                            </div>
                        );
                    })}
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
