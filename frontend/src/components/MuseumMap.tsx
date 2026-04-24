import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Eye, Lightbulb, Compass, MapPin, Lock } from 'lucide-react';
import { hallsData } from '../data/halls';
import { artifactsData, type Artifact } from '../data/artifacts';
import { useMuseum } from '../context/MuseumContext';
import { distributePointsInPolygon, getPolygonBounds } from '../utils/geometry';

const MuseumMap = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { viewedArtifacts, isHallUnlocked, isHallComplete } = useMuseum();
    const isAr = i18n.language === 'ar';

    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
    const [hoveredHall, setHoveredHall] = useState<string | null>(null);

    // Pre-compute artifact positions inside their hall polygons
    const artifactPositions = useMemo(() => {
        const positions: Record<string, { x: number; y: number }> = {};

        for (const hall of hallsData) {
            if (!hall.polygon || hall.polygon.length < 3) continue;

            const hallArtifacts = hall.artifactIds;
            const distributed = distributePointsInPolygon(hall.polygon, hallArtifacts.length, 2);

            hallArtifacts.forEach((artifactId, i) => {
                if (distributed[i]) {
                    positions[artifactId] = distributed[i];
                }
            });
        }

        // Special override: Ramesses statue stays at the entrance
        positions['colossal-statue-of-ramesses-ii'] = { x: 48, y: 88 };

        return positions;
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full mx-auto py-6">

            {/* ====== MAP + DETAIL LAYOUT ====== */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* ====== LEFT: INTERACTIVE IMAGE MAP ====== */}
                <div
                    className="relative flex-1 w-full rounded-2xl overflow-auto"
                    style={{ maxHeight: '85vh' }}
                >
                    <div className="relative inline-block" style={{ minWidth: '1400px' }}>
                        {/* Map Image */}
                        <img
                            src="/images/museum_map.png"
                            alt="Egyptian Museum Map"
                            className="block w-full h-auto select-none"
                            draggable={false}
                        />

                        {/* ====== SVG OVERLAY LAYER ====== */}
                        <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            style={{ pointerEvents: 'none' }}
                        >
                            <defs>
                                {/* Fog blur filter */}
                                <filter id="fog-blur" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="0.8" />
                                </filter>
                                {/* Fog turbulence for smoky effect */}
                                <filter id="fog-smoke" x="-20%" y="-20%" width="140%" height="140%">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise" />
                                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                                    <feGaussianBlur stdDeviation="0.5" />
                                </filter>
                            </defs>

                            {/* Fog overlays for LOCKED halls */}
                            {hallsData.map((hall) => {
                                if (isHallUnlocked(hall.id)) return null;
                                if (!hall.polygon || hall.polygon.length < 3) return null;

                                const points = hall.polygon
                                    .map(p => `${p.x},${p.y}`)
                                    .join(' ');

                                return (
                                    <g key={`fog-${hall.id}`}>
                                        {/* Dark fog layer */}
                                        <polygon
                                            points={points}
                                            fill="rgba(0, 0, 0, 0.75)"
                                            filter="url(#fog-blur)"
                                            className="fog-polygon"
                                        />
                                        {/* Smoky texture layer */}
                                        <polygon
                                            points={points}
                                            fill="rgba(10, 5, 20, 0.5)"
                                            filter="url(#fog-smoke)"
                                            className="fog-polygon"
                                        />
                                    </g>
                                );
                            })}

                            {/* Hall outline highlights on hover */}
                            {hallsData.map((hall) => {
                                if (!isHallUnlocked(hall.id)) return null;
                                if (!hall.polygon || hall.polygon.length < 3) return null;

                                const points = hall.polygon
                                    .map(p => `${p.x},${p.y}`)
                                    .join(' ');

                                const isHovered = hoveredHall === hall.id;

                                return (
                                    <polygon
                                        key={`outline-${hall.id}`}
                                        points={points}
                                        fill={isHovered ? `${hall.color}15` : 'transparent'}
                                        stroke={isHovered ? hall.color : 'transparent'}
                                        strokeWidth="0.3"
                                        style={{
                                            transition: 'all 0.3s ease',
                                            pointerEvents: 'visiblePainted',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={() => setHoveredHall(hall.id)}
                                        onMouseLeave={() => setHoveredHall(null)}
                                    />
                                );
                            })}
                        </svg>

                        {/* ====== LOCK ICONS for locked halls ====== */}
                        {hallsData.map((hall) => {
                            if (isHallUnlocked(hall.id)) return null;
                            if (!hall.polygon || hall.polygon.length < 3) return null;

                            const bounds = getPolygonBounds(hall.polygon);
                            const prevHall = hallsData.find(h => h.id === hall.prerequisiteHallId);
                            const prevName = prevHall
                                ? (isAr ? prevHall.nameAr : prevHall.name)
                                : '';

                            return (
                                <div
                                    key={`lock-${hall.id}`}
                                    className="absolute flex flex-col items-center gap-1 pointer-events-none select-none"
                                    style={{
                                        top: `${bounds.centerY}%`,
                                        left: `${bounds.centerX}%`,
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 30,
                                    }}
                                >
                                    <div className="w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm border-2 border-amber-500/40 flex items-center justify-center shadow-lg shadow-black/50 fog-pulse">
                                        <Lock size={20} className="text-amber-400" />
                                    </div>
                                    <div className="bg-black/80 backdrop-blur-sm text-center rounded-lg px-3 py-1.5 border border-amber-500/20 shadow-lg">
                                        <p className="text-amber-400 text-xs font-bold">
                                            {hall.icon} {isAr ? hall.nameAr : hall.name}
                                        </p>
                                        <p className="text-gray-400 text-[10px] mt-0.5">
                                            {t('completePrevious', `Complete "${prevName}" to unlock`)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* ====== ARTIFACT PINS for unlocked halls ====== */}
                        {hallsData.map((hall) => {
                            if (!isHallUnlocked(hall.id)) return null;

                            const hallArtifacts = hall.artifactIds
                                .map(id => artifactsData.find(a => a.id === id))
                                .filter(Boolean) as Artifact[];

                            return hallArtifacts.map((artifact) => {
                                const pos = artifactPositions[artifact.id];
                                if (!pos) return null;

                                const isSelected = selectedArtifact?.id === artifact.id;
                                const isViewed = viewedArtifacts.includes(artifact.id);

                                return (
                                    <div
                                        key={artifact.id}
                                        onClick={() => setSelectedArtifact(artifact)}
                                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform duration-300 ${isSelected ? 'scale-125 z-50' : 'hover:scale-125 hover:z-40'}`}
                                        style={{
                                            top: `${pos.y}%`,
                                            left: `${pos.x}%`,
                                            zIndex: isSelected ? 50 : 10,
                                        }}
                                    >
                                        {/* Pin thumbnail */}
                                        <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 shadow-lg transition-all duration-200 ${isSelected ? 'border-amber-500 shadow-amber-500/50 ring-2 ring-amber-400/30' : isViewed ? 'border-green-400 shadow-green-400/30' : 'border-white/80 shadow-black/40'}`}>
                                            <img
                                                src={artifact.image}
                                                alt={artifact.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                                            {/* Viewed checkmark */}
                                            {isViewed && (
                                                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center border border-white">
                                                    <span className="text-white text-[8px] font-bold">✓</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Tooltip on hover */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[140px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gray-900/95 text-white text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-lg text-center shadow-xl border border-white/10">
                                            {isAr ? artifact.nameAr : artifact.name}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95" />
                                        </div>
                                    </div>
                                );
                            });
                        })}

                        {/* ====== HALL NAME LABELS for unlocked halls ====== */}
                        {hallsData.map((hall) => {
                            if (!isHallUnlocked(hall.id)) return null;
                            if (!hall.polygon || hall.polygon.length < 3) return null;

                            const bounds = getPolygonBounds(hall.polygon);
                            const complete = isHallComplete(hall.id);

                            return (
                                <div
                                    key={`label-${hall.id}`}
                                    className="absolute pointer-events-none select-none"
                                    style={{
                                        top: `${bounds.minY + 2}%`,
                                        left: `${bounds.centerX}%`,
                                        transform: 'translateX(-50%)',
                                        zIndex: 5,
                                    }}
                                >
                                    <div className="bg-black/50 backdrop-blur-sm text-center rounded-md px-2 py-1 border border-white/10">
                                        <p className="text-[10px] font-bold" style={{ color: hall.color }}>
                                            {hall.icon} {isAr ? hall.nameAr : hall.name}
                                            {complete && ' ✅'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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

                                {/* Unlock Progress */}
                                <div className="mt-6 w-full max-w-[260px]">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                        {t('unlockProgress', 'Hall Progress')}
                                    </p>
                                    {hallsData
                                        .sort((a, b) => a.unlockOrder - b.unlockOrder)
                                        .map((hall) => {
                                            const unlocked = isHallUnlocked(hall.id);
                                            const complete = isHallComplete(hall.id);
                                            return (
                                                <div
                                                    key={hall.id}
                                                    className={`flex items-center gap-2 py-1.5 text-xs font-medium ${unlocked ? (complete ? 'text-green-600' : 'text-amber-600') : 'text-gray-300'}`}
                                                >
                                                    <span>{complete ? '✅' : unlocked ? '🔓' : '🔒'}</span>
                                                    <span>{hall.icon} {isAr ? hall.nameAr : hall.name}</span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
};

export default MuseumMap;
