import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Eye, Lightbulb, Compass, MapPin } from 'lucide-react';
import { hallsData } from '../data/halls';
import { artifactsData, type Artifact } from '../data/artifacts';
import { useMuseum } from '../context/MuseumContext';

// Define percentage-based bounds for each hall over the background image.
// (top, left, width, height) in percentages.
const HALL_ZONES: Record<string, { top: number, left: number, width: number, height: number }> = {
    'grand-hall': { top: 75, left: 35, width: 30, height: 15 },
    'grand-stairs': { top: 55, left: 35, width: 30, height: 20 },
    'tutankhamun-galleries': { top: 20, left: 10, width: 35, height: 35 },
    'main-galleries': { top: 20, left: 55, width: 35, height: 35 },
    'khufu-s-boats': { top: 5, left: 60, width: 25, height: 15 },
    'hanging-obelisk': { top: 85, left: 60, width: 20, height: 15 }
};

const MuseumMap = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { viewedArtifacts } = useMuseum();
    const isAr = i18n.language === 'ar';

    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-6">
            <div className="text-center mb-4">
                <h2 className="text-4xl font-bold text-amber-900 mb-2">
                    {t('mapWelcome', 'Interactive Museum Map')}
                </h2>
                <p className="text-gray-600">
                    {t('mapInstruction', 'Click on the artifact pins on the map to explore the pieces!')}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* ====== LEFT: INTERACTIVE IMAGE MAP ====== */}
                <div className="relative flex-1 lg:max-w-[65%] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-600/30 bg-amber-50">
                    <img
                        src="/images/user_museum_map.jpeg"
                        alt="Egyptian Museum Map"
                        className="w-full h-auto object-cover block"
                    />

                    {/* OVERLAYS FOR THE ARTIFACTS */}
                    {hallsData.map((hall) => {
                        const zone = HALL_ZONES[hall.id] || { top: 10, left: 10, width: 10, height: 10 };
                        const hallArtifacts = hall.artifactIds.map(id => artifactsData.find(a => a.id === id)).filter(Boolean) as Artifact[];

                        // Calculate grid/distribution within the zone
                        const count = hallArtifacts.length;
                        const cols = Math.ceil(Math.sqrt(count)) || 1;

                        return hallArtifacts.map((artifact, index) => {
                            // Specific override requested by user:
                            // "put the status of ramsus in the entrance and put it flow on the small put"
                            let topPos = zone.top + ((Math.floor(index / cols) + 1) * (zone.height / (Math.ceil(count / cols) + 1)));
                            let leftPos = zone.left + (((index % cols) + 1) * (zone.width / (cols + 1)));

                            if (artifact.id === 'colossal-statue-of-ramesses-ii') {
                                // Entrance coordinates (e.g. bottom center)
                                topPos = 88;
                                leftPos = 48;
                            }

                            const isSelected = selectedArtifact?.id === artifact.id;
                            const isViewed = viewedArtifacts.includes(artifact.id);

                            return (
                                <div
                                    key={artifact.id}
                                    onClick={() => setSelectedArtifact(artifact)}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 transition-transform duration-300 ${isSelected ? 'scale-125 z-50' : 'hover:scale-125 hover:z-40'}`}
                                    style={{ top: `${topPos}%`, left: `${leftPos}%` }}
                                >
                                    {/* Map Pin / Image Thumbnail */}
                                    <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 shadow-lg ${isSelected ? 'border-amber-500 shadow-amber-500/50' : 'border-white'}`}>
                                        <img
                                            src={artifact.image}
                                            alt={artifact.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                                        {/* Viewed Checkmark */}
                                        {isViewed && (
                                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center border border-white">
                                                <span className="text-white text-[8px] font-bold">✓</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tooltip on Hover */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[120px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gray-900/90 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-lg text-center shadow-xl">
                                        {isAr ? artifact.nameAr : artifact.name}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/90" />
                                    </div>
                                </div>
                            );
                        });
                    })}
                </div>

                {/* ====== RIGHT: DETAIL PANEL ====== */}
                <div className="flex-1 lg:max-w-[35%] w-full h-fit sticky top-24">
                    <AnimatePresence mode="wait">
                        {selectedArtifact ? (
                            <motion.div
                                key={selectedArtifact.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                            >
                                {/* Artifact Image */}
                                <div className="relative h-60">
                                    <img
                                        src={selectedArtifact.image}
                                        alt={isAr ? selectedArtifact.nameAr : selectedArtifact.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <button
                                        onClick={() => setSelectedArtifact(null)}
                                        className="absolute top-4 right-4 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all z-20"
                                    >
                                        <X size={16} />
                                    </button>

                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <div className="text-xs font-bold text-amber-400 mb-1 tracking-wider uppercase drop-shadow-md">
                                            {isAr ? hallsData.find(h => h.id === selectedArtifact.hallId)?.nameAr : hallsData.find(h => h.id === selectedArtifact.hallId)?.name}
                                        </div>
                                        <h3 className="text-2xl font-bold leading-tight drop-shadow-lg">
                                            {isAr ? selectedArtifact.nameAr : selectedArtifact.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Info Content */}
                                <div className="p-6">
                                    <div className="bg-amber-50 rounded-2xl p-4 mb-5 border border-amber-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lightbulb className="text-amber-600" size={16} />
                                            <p className="text-amber-800 font-bold text-xs uppercase tracking-wider">
                                                {t('funFact', 'Fun Fact')}
                                            </p>
                                        </div>
                                        <p className="text-gray-800 font-medium text-sm leading-relaxed">
                                            {isAr ? selectedArtifact.funFactAr : selectedArtifact.funFact}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                            {t('description', 'Description')}
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                            {isAr ? selectedArtifact.descriptionAr : selectedArtifact.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3 mt-4">
                                        <motion.button
                                            onClick={() => navigate(`/artifact/${selectedArtifact.id}`)}
                                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition shadow-lg shadow-amber-600/30"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Eye size={18} />
                                            <span>{t('exploreMore', 'View Details')}</span>
                                        </motion.button>

                                        <motion.button
                                            onClick={() => navigate(`/hall/${selectedArtifact.hallId}`)}
                                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 border border-gray-200 transition"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Compass size={18} className="text-gray-500" />
                                            <span>{t('backToHall', 'Go To Hall')}</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-3xl shadow-xl p-8 h-[450px] flex flex-col items-center justify-center text-center border border-gray-100"
                            >
                                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6 shadow-sm border border-amber-100">
                                    <MapPin size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">
                                    {t('mapWelcome', 'Explore the Artifacts')}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">
                                    {t('mapInstruction', 'Click on any interactive artifact pin on the map to uncover its history.')}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
};

export default MuseumMap;
