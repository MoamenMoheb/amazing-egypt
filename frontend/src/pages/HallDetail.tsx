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
        <div className="min-h-screen bg-[#020C1B] selection:bg-[#FFD700] selection:text-[#0A192F] pt-24 pb-10 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back button */}
                <Link to="/map" className="flex items-center gap-2 text-[#FFD700] font-bold mb-6 hover:text-white transition-colors w-fit">
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
                                className="absolute top-4 right-4 bg-[#FFD700] text-[#0A192F] px-4 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(255,215,0,0.5)] flex items-center gap-2"
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
                        className="bg-[#1A5276]/40 backdrop-blur-md border border-[#3498DB]/30 rounded-2xl p-6 mb-8 text-[#E5E7EB]"
                    >
                        <h3 className="text-lg font-bold text-[#FFD700] mb-2 flex items-center gap-2">
                            <span className="text-xl">📚</span> {t('parentMode')}
                        </h3>
                        <p className="leading-relaxed">
                            {t(`halls.${hall.id}.parentInfo`)}
                        </p>
                    </motion.div>
                )}

                {/* Artifacts Grid */}
                <h2 className="text-2xl font-bold text-[#FFD700] mb-6 drop-shadow-md flex items-center gap-2">
                    <span className="text-3xl">🏺</span> Artifacts
                </h2>
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
                        <button
                            onClick={() => setShowQuiz(true)}
                            className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[orange] text-[#0A192F] text-xl font-bold rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-all hover:scale-105 active:scale-95"
                            id="take-quiz-btn"
                        >
                            {t('takeQuiz')}
                        </button>
                        <p className="text-[#85C1E9] mt-3 tracking-wide text-sm font-medium">Explore {2 - viewedInHall > 0 ? `${2 - viewedInHall} more` : ''} artifacts to unlock!</p>
                    </motion.div>
                )}

                {hasEarnedBadge && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-[#1A5276]/30 backdrop-blur-md p-8 rounded-3xl border border-[#00A8E8]/40 shadow-[0_0_30px_rgba(0,168,232,0.2)]"
                    >
                        <p className="text-5xl mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">{hall.badge.icon}</p>
                        <p className="text-2xl font-bold text-[#FFD700] mb-1">{t('hallComplete')}</p>
                        <p className="text-[#E5E7EB] font-medium text-lg">{isAr ? hall.badge.nameAr : hall.badge.name} Badge Earned!</p>
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
