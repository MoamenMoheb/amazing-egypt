import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import BadgeDisplay from '../components/BadgeDisplay';
import Character from '../components/Character';
import { useMuseum } from '../context/MuseumContext';
import { hallsData } from '../data/halls';

const Badges = () => {
    const { t } = useTranslation();
    const { badges, score } = useMuseum();

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pt-0 pb-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-amber-700 mb-2">🏅 {t('yourBadges')}</h1>
                    <p className="text-amber-600">
                        {badges.length === 0 ? t('noBadges') : `${badges.length}/${hallsData.length} badges earned!`}
                    </p>
                </motion.div>

                {/* Score */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <div className="inline-block bg-gradient-to-r from-amber-100 to-yellow-100 px-8 py-4 rounded-2xl border-2 border-amber-300 shadow-md">
                        <p className="text-sm font-bold text-amber-700">{t('score')}</p>
                        <p className="text-4xl font-bold text-amber-600">⭐ {score}</p>
                    </div>
                </motion.div>

                {/* Character */}
                <div className="flex justify-center mb-8">
                    <Character
                        inline
                        size={220}
                        mood={badges.length === hallsData.length ? 'excited' : badges.length > 0 ? 'happy' : 'waving'}
                        message={
                            badges.length === hallsData.length
                                ? "You've collected ALL the badges! You're a TRUE Egyptian explorer! 🏆"
                                : badges.length > 0
                                    ? `Great job! You have ${badges.length} badge${badges.length > 1 ? 's' : ''}! Keep exploring!`
                                    : "Explore the museum halls and take quizzes to earn badges! 🏛️"
                        }
                    />
                </div>

                {/* Badge Grid */}
                <BadgeDisplay />

                {/* All badges collected celebration */}
                {badges.length === hallsData.length && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="mt-8 text-center bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 p-8 rounded-3xl border-2 border-amber-400 shadow-xl"
                    >
                        <p className="text-6xl mb-4">🏆</p>
                        <h2 className="text-2xl font-bold text-amber-800 mb-2">Master Explorer!</h2>
                        <p className="text-amber-700">You've explored the entire Grand Egyptian Museum! Amazing job!</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Badges;
