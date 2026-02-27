import { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { artifactsData } from '../data/artifacts';
import { hallsData } from '../data/halls';
import { useMuseum } from '../context/MuseumContext';
import Character from '../components/Character';
import DidYouKnow from '../components/DidYouKnow';

const ArtifactDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { markViewed, addScore, isParentMode } = useMuseum();
    const isAr = i18n.language === 'ar';

    const artifact = artifactsData.find(a => a.id === id);
    const hall = artifact ? hallsData.find(h => h.id === artifact.hallId) : null;

    // Find next artifact in same hall
    const nextArtifact = useMemo(() => {
        if (!artifact || !hall) return null;
        const hallArtifacts = artifactsData.filter(a => a.hallId === artifact.hallId);
        const currentIndex = hallArtifacts.findIndex(a => a.id === artifact.id);
        return currentIndex < hallArtifacts.length - 1 ? hallArtifacts[currentIndex + 1] : null;
    }, [artifact, hall]);

    useEffect(() => {
        if (artifact) {
            markViewed(artifact.id);
            addScore(10);
        }
    }, [artifact?.id]);

    if (!artifact || !hall) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Artifact not found!</p>
            </div>
        );
    }

    const handleSpeak = () => {
        const text = isAr ? artifact.storyAr : artifact.story;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isAr ? 'ar-SA' : 'en-US';
        utterance.rate = 0.85;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pt-24 pb-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <Link
                    to={`/hall/${hall.id}`}
                    className="flex items-center gap-2 text-amber-700 font-bold mb-6 hover:underline"
                >
                    <ArrowLeft size={20} /> {t('backToHall')}
                </Link>

                {/* Artifact Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-200"
                >
                    {/* Image */}
                    <div className="relative h-64 md:h-96">
                        <img
                            src={artifact.image}
                            alt={isAr ? artifact.nameAr : artifact.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                            <div>
                                <div className="text-4xl mb-2">{artifact.icon}</div>
                                <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                                    {isAr ? artifact.nameAr : artifact.name}
                                </h1>
                            </div>
                        </div>

                        {/* Hall badge */}
                        <div
                            className="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg"
                            style={{ backgroundColor: hall.color }}
                        >
                            {hall.icon} {isAr ? hall.nameAr : hall.name}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 space-y-6">
                        {/* Character + Description */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0">
                                <Character
                                    inline
                                    size={200}
                                    mood="excited"
                                    message={t('character.artifactIntro')}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-medium">
                                    {isAr ? artifact.descriptionAr : artifact.description}
                                </p>
                            </div>
                        </div>

                        {/* Story Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-bold text-indigo-800">📖 The Story</h3>
                                <motion.button
                                    onClick={handleSpeak}
                                    className="bg-indigo-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-md"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    id="listen-story-btn"
                                >
                                    <Volume2 size={16} /> {t('listenToStory')}
                                </motion.button>
                            </div>
                            <p className="text-indigo-900 leading-relaxed font-medium">
                                {isAr ? artifact.storyAr : artifact.story}
                            </p>
                        </motion.div>

                        {/* Fun Fact */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-300"
                        >
                            <h3 className="text-xl font-bold text-green-800 mb-2">{t('funFact')}</h3>
                            <p className="text-green-900 font-medium leading-relaxed">
                                {isAr ? artifact.funFactAr : artifact.funFact}
                            </p>
                        </motion.div>

                        {/* Did You Know */}
                        <DidYouKnow text={isAr ? artifact.didYouKnowAr : artifact.didYouKnow} />

                        {/* Parent Mode - Extra Info */}
                        {isParentMode && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6"
                            >
                                <h3 className="text-lg font-bold text-blue-800 mb-2">📚 {t('parentMode')}</h3>
                                <p className="text-blue-700 leading-relaxed">
                                    {t(`halls.${hall.id}.parentInfo`)}
                                </p>
                            </motion.div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between items-center pt-4 border-t-2 border-amber-100">
                            <Link
                                to={`/hall/${hall.id}`}
                                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                ← {t('backToHall')}
                            </Link>
                            {nextArtifact && (
                                <motion.button
                                    onClick={() => navigate(`/artifact/${nextArtifact.id}`)}
                                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('nextArtifact')}
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ArtifactDetail;
