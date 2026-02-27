import { motion } from 'framer-motion';
import { hallsData } from '../data/halls';
import { useMuseum } from '../context/MuseumContext';

const BadgeDisplay = () => {
    const { badges } = useMuseum();

    const allBadges = hallsData.map(h => h.badge);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {allBadges.map((badge, i) => {
                const isEarned = badges.includes(badge.id);

                return (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                        className={`relative flex flex-col items-center p-6 rounded-3xl border-3 shadow-lg transition-all ${isEarned
                                ? 'bg-gradient-to-b from-amber-50 to-yellow-100 border-amber-400 shadow-amber-200'
                                : 'bg-gray-100 border-gray-300 opacity-60'
                            }`}
                        style={{ borderWidth: '3px' }}
                    >
                        {/* Glow for earned */}
                        {isEarned && (
                            <div className="absolute inset-0 rounded-3xl bg-amber-400 opacity-10 animate-pulse" />
                        )}

                        {/* Badge icon */}
                        <div className={`text-5xl mb-3 ${isEarned ? '' : 'grayscale'}`}>
                            {isEarned ? badge.icon : '🔒'}
                        </div>

                        {/* Badge name */}
                        <p className={`text-sm font-bold text-center ${isEarned ? 'text-amber-800' : 'text-gray-500'
                            }`}>
                            {isEarned ? badge.name : '???'}
                        </p>

                        {/* Earned indicator */}
                        {isEarned && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                            >
                                ✓
                            </motion.div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default BadgeDisplay;
