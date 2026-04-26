import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Eye, Lightbulb, Compass, Lock } from 'lucide-react';
import { hallsData } from '../data/halls';
import { artifactsData, type Artifact } from '../data/artifacts';
import { useMuseum } from '../context/MuseumContext';
import { distributePointsInPolygon, getPolygonBounds } from '../utils/geometry';
import { getAssetUrl } from '../utils/getAssetUrl';

const MuseumMap = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { viewedArtifacts, isHallUnlocked, isHallComplete } = useMuseum();
    const isAr = i18n.language === 'ar';

    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
    const [hoveredArtifact, setHoveredArtifact] = useState<Artifact | null>(null);
    const [hoveredHall, setHoveredHall] = useState<string | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

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

    // Which hall is the selected artifact in?
    const selectedHallId = selectedArtifact?.hallId ?? null;

    // Close popup when clicking on empty map area
    const handleMapBackgroundClick = (e: React.MouseEvent) => {
        if (
            (e.target as HTMLElement).closest('[data-artifact-pin]') ||
            (e.target as HTMLElement).closest('[data-popup]')
        ) return;
        setSelectedArtifact(null);
    };

    return (
        <div
            ref={mapContainerRef}
            className="relative w-full h-full overflow-auto"
            onClick={handleMapBackgroundClick}
            style={{ cursor: selectedArtifact ? 'default' : 'grab' }}
        >
            {/* ====== MAP INNER: extra-wide so the user scrolls around like MetKids ====== */}
            <div className="relative inline-block" style={{ minWidth: '2200px' }}>
                {/* Map Image */}
                <img
                    src={getAssetUrl('/images/museum_map.png')}
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

                    {/* ====== SPOTLIGHT FADE: darken all halls except the selected one ====== */}
                    {selectedArtifact && hallsData.map((hall) => {
                        if (!isHallUnlocked(hall.id)) return null;
                        if (hall.id === selectedHallId) return null; // don't darken the active hall
                        if (!hall.polygon || hall.polygon.length < 3) return null;

                        const points = hall.polygon
                            .map(p => `${p.x},${p.y}`)
                            .join(' ');

                        return (
                            <polygon
                                key={`fade-${hall.id}`}
                                points={points}
                                fill="rgba(0, 0, 0, 0.55)"
                                style={{
                                    transition: 'fill 0.5s ease',
                                    pointerEvents: 'none',
                                }}
                            />
                        );
                    })}
                </svg>

                {/* ====== FULL-MAP DARK OVERLAY when an artifact is selected ====== */}
                <AnimatePresence>
                    {selectedArtifact && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.45) 60%)',
                                zIndex: 8,
                            }}
                        />
                    )}
                </AnimatePresence>

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

                {/* ====== DIAMOND ARTIFACT PINS for unlocked halls ====== */}
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
                        const isHovered = hoveredArtifact?.id === artifact.id;

                        // Determine diamond color
                        const diamondColor = isSelected
                            ? '#FFD700'
                            : isViewed
                            ? '#22c55e'
                            : '#e74c3c';

                        const diamondGlow = isSelected
                            ? '0 0 16px rgba(255,215,0,0.8), 0 0 30px rgba(255,215,0,0.4)'
                            : isViewed
                            ? '0 0 10px rgba(34,197,94,0.5)'
                            : '0 0 10px rgba(231,76,60,0.6)';

                        return (
                            <div
                                key={artifact.id}
                                data-artifact-pin
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedArtifact(artifact);
                                }}
                                onMouseEnter={() => setHoveredArtifact(artifact)}
                                onMouseLeave={() => setHoveredArtifact(null)}
                                className="absolute cursor-pointer"
                                style={{
                                    top: `${pos.y}%`,
                                    left: `${pos.x}%`,
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: isSelected ? 55 : isHovered ? 45 : 10,
                                }}
                            >
                                {/* Diamond marker */}
                                <div
                                    className="diamond-pin"
                                    style={{
                                        width: isSelected ? '18px' : '14px',
                                        height: isSelected ? '18px' : '14px',
                                        backgroundColor: diamondColor,
                                        transform: 'rotate(45deg)',
                                        borderRadius: '3px',
                                        boxShadow: diamondGlow,
                                        border: `2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.6)'}`,
                                        transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                                    }}
                                />

                                {/* Viewed checkmark — small dot */}
                                {isViewed && !isSelected && (
                                    <div
                                        className="absolute flex items-center justify-center"
                                        style={{
                                            top: '-6px',
                                            right: '-6px',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: '#22c55e',
                                            border: '1.5px solid white',
                                            fontSize: '7px',
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        ✓
                                    </div>
                                )}

                                {/* ====== HOVER POPUP: small artifact image thumbnail ====== */}
                                <AnimatePresence>
                                    {isHovered && !isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.7, y: 8 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.7, y: 8 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute pointer-events-none"
                                            style={{
                                                bottom: 'calc(100% + 12px)',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                zIndex: 60,
                                            }}
                                        >
                                            <div className="relative bg-black/90 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-amber-500/30"
                                                style={{ width: '140px' }}
                                            >
                                                {/* Thumbnail */}
                                                <div className="w-full h-[100px] overflow-hidden">
                                                    <img
                                                        src={getAssetUrl(artifact.image)}
                                                        alt={isAr ? artifact.nameAr : artifact.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {/* Name label */}
                                                <div className="px-2 py-1.5">
                                                    <p className="text-white text-[10px] font-bold leading-tight text-center truncate">
                                                        {isAr ? artifact.nameAr : artifact.name}
                                                    </p>
                                                </div>
                                                {/* Arrow pointer */}
                                                <div
                                                    className="absolute left-1/2 -translate-x-1/2"
                                                    style={{
                                                        bottom: '-6px',
                                                        width: 0,
                                                        height: 0,
                                                        borderLeft: '6px solid transparent',
                                                        borderRight: '6px solid transparent',
                                                        borderTop: '6px solid rgba(0,0,0,0.9)',
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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

            {/* ====== FIXED POPUP OVERLAY — zoomed artifact detail ====== */}
            <AnimatePresence>
                {selectedArtifact && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-[60]"
                            onClick={() => setSelectedArtifact(null)}
                        />

                        {/* Popup card */}
                        <motion.div
                            data-popup
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                            className="fixed z-[70] w-[92vw] max-w-[440px] max-h-[88vh] overflow-y-auto rounded-3xl shadow-2xl"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
                                border: '1px solid rgba(255, 215, 0, 0.25)',
                                boxShadow: '0 0 60px rgba(255,215,0,0.12), 0 25px 50px rgba(0,0,0,0.5)',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Hero Image — zoomed in */}
                            <div className="relative h-64 sm:h-72 overflow-hidden">
                                <motion.img
                                    src={getAssetUrl(selectedArtifact.image)}
                                    alt={isAr ? selectedArtifact.nameAr : selectedArtifact.name}
                                    className="w-full h-full object-cover"
                                    initial={{ scale: 1.3 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/30 to-transparent" />
                                <button
                                    onClick={() => setSelectedArtifact(null)}
                                    className="absolute top-4 right-4 w-9 h-9 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 hover:scale-110 transition-all z-20 border border-white/10"
                                >
                                    <X size={16} />
                                </button>

                                <div className="absolute bottom-4 left-5 right-5 text-white">
                                    <div className="text-xs font-bold text-amber-400 mb-1 tracking-wider uppercase drop-shadow-md">
                                        {isAr ? hallsData.find(h => h.id === selectedArtifact.hallId)?.nameAr : hallsData.find(h => h.id === selectedArtifact.hallId)?.name}
                                    </div>
                                    <h3 className="text-2xl font-bold leading-tight drop-shadow-lg">
                                        {isAr ? selectedArtifact.nameAr : selectedArtifact.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Info Content */}
                            <div className="p-5 sm:p-6">
                                <div className="rounded-2xl p-4 mb-5 border border-amber-500/20" style={{ background: 'rgba(255, 215, 0, 0.06)' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lightbulb className="text-amber-400" size={16} />
                                        <p className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                                            {t('funFact', 'Fun Fact')}
                                        </p>
                                    </div>
                                    <p className="text-gray-200 font-medium text-sm leading-relaxed">
                                        {isAr ? selectedArtifact.funFactAr : selectedArtifact.funFact}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        {t('description', 'Description')}
                                    </h4>
                                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                        {isAr ? selectedArtifact.descriptionAr : selectedArtifact.description}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
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
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 text-gray-200 font-bold hover:bg-white/10 border border-white/10 transition"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Compass size={18} className="text-gray-400" />
                                        <span>{t('backToHall', 'Go To Hall')}</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MuseumMap;
