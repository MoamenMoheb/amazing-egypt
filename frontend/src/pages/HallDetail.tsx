import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { hallsData } from '../data/halls';
import { artifactsData } from '../data/artifacts';
import { useMuseum } from '../context/MuseumContext';
import Character from '../components/Character';
import ArtifactCard from '../components/ArtifactCard';
import QuizModal from '../components/QuizModal';

const HallDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const { viewedArtifacts, earnBadge, addScore, badges, isParentMode } = useMuseum();
    const isAr = i18n.language === 'ar';

    const hall = hallsData.find(h => h.id === id);
    const hallArtifacts = artifactsData.filter(a => a.hallId === id);

    const [showQuiz, setShowQuiz] = useState(false);
    const [characterMessage, setCharacterMessage] = useState('');

    const viewedInHall = hallArtifacts.filter(a => viewedArtifacts.includes(a.id)).length;
    const canTakeQuiz = viewedInHall >= 2;
    const hasEarnedBadge = hall ? badges.includes(hall.badge.id) : false;

    useEffect(() => {
        if (hall) {
            const hallName = isAr ? hall.nameAr : hall.name;
            setCharacterMessage(t('character.hallIntro', { hall: hallName }));
            const timer = setTimeout(() => {
                if (canTakeQuiz && !hasEarnedBadge) {
                    setCharacterMessage(t('character.quizPrompt'));
                } else {
                    setCharacterMessage(t('character.encourage'));
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [hall, canTakeQuiz, hasEarnedBadge, t, isAr]);

    if (!hall) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Hall not found!</p>
            </div>
        );
    }

    const handleQuizCorrect = () => {
        earnBadge(hall.badge.id);
        addScore(100);
        setCharacterMessage(t('character.celebrate'));
        setTimeout(() => setShowQuiz(false), 2500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pt-24 pb-10 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back button */}
                <Link to="/map" className="flex items-center gap-2 text-amber-700 font-bold mb-6 hover:underline">
                    <ArrowLeft size={20} /> {t('backToMap')}
                </Link>

                {/* Hall Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl mb-8"
                    style={{ background: `linear-gradient(135deg, ${hall.color}CC, ${hall.color}66)` }}
                >
                    <div className="p-8 md:p-12 text-white relative">
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10">
                            {Array.from({ length: 20 }, (_, i) => (
                                <span
                                    key={i}
                                    className="absolute text-4xl"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        transform: `rotate(${Math.random() * 360}deg)`,
                                    }}
                                >
                                    {hall.icon}
                                </span>
                            ))}
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                            <div className="text-6xl md:text-8xl">{hall.icon}</div>
                            <div>
                                <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                                    {isAr ? hall.nameAr : hall.name}
                                </h1>
                                <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                                    {isAr ? hall.descriptionAr : hall.description}
                                </p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="relative z-10 mt-6">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-bold">{t('artifactsExplored')}</span>
                                <span className="font-bold">{viewedInHall}/{hallArtifacts.length}</span>
                            </div>
                            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(viewedInHall / hallArtifacts.length) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Badge earned indicator */}
                        {hasEarnedBadge && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-4 right-4 bg-white text-amber-700 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
                            >
                                {hall.badge.icon} {isAr ? hall.badge.nameAr : hall.badge.name}
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Character */}
                <div className="flex justify-center mb-8">
                    <Character
                        inline
                        size={220}
                        mood={hasEarnedBadge ? 'excited' : 'happy'}
                        message={characterMessage}
                    />
                </div>

                {/* Parent Mode Info */}
                {isParentMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8"
                    >
                        <h3 className="text-lg font-bold text-blue-800 mb-2">📚 {t('parentMode')}</h3>
                        <p className="text-blue-700 leading-relaxed">
                            {t(`halls.${hall.id}.parentInfo`)}
                        </p>
                    </motion.div>
                )}

                {/* Artifacts Grid */}
                <h2 className="text-2xl font-bold text-amber-800 mb-6">🏺 Artifacts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {hallArtifacts.map((artifact, i) => (
                        <ArtifactCard key={artifact.id} artifact={artifact} hallId={hall.id} index={i} />
                    ))}
                </div>

                {/* Quiz button */}
                {canTakeQuiz && !hasEarnedBadge && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <motion.button
                            onClick={() => setShowQuiz(true)}
                            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            id="take-quiz-btn"
                        >
                            {t('takeQuiz')}
                        </motion.button>
                        <p className="text-gray-500 mt-2 text-sm">Explore {2 - viewedInHall > 0 ? `${2 - viewedInHall} more` : ''} artifacts to unlock!</p>
                    </motion.div>
                )}

                {hasEarnedBadge && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-3xl border-2 border-green-300 shadow-lg"
                    >
                        <p className="text-4xl mb-2">{hall.badge.icon}</p>
                        <p className="text-xl font-bold text-green-700">{t('hallComplete')}</p>
                        <p className="text-green-600">{isAr ? hall.badge.nameAr : hall.badge.name} Badge Earned!</p>
                    </motion.div>
                )}
            </div>

            {/* Quiz Modal */}
            <QuizModal
                isOpen={showQuiz}
                onClose={() => setShowQuiz(false)}
                question={isAr ? hall.quizQuestion.questionAr : hall.quizQuestion.question}
                options={isAr ? hall.quizQuestion.optionsAr : hall.quizQuestion.options}
                correctIndex={hall.quizQuestion.correctIndex}
                onCorrect={handleQuizCorrect}
                hallName={isAr ? hall.nameAr : hall.name}
            />
        </div>
    );
};

export default HallDetail;
