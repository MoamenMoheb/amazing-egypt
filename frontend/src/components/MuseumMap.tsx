import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Lightbulb, Lock } from 'lucide-react';
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
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInnerRef = useRef<HTMLDivElement>(null);

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


    // Scroll the map to center the selected artifact in the map-visible area (left half)
    const scrollToArtifact = useCallback((artifact: Artifact) => {
        const container = mapContainerRef.current;
        const inner = mapInnerRef.current;
        if (!container || !inner) return;

        const pos = artifactPositions[artifact.id];
        if (!pos) return;

        // The artifact position in pixels on the inner map
        const mapWidth = inner.scrollWidth;
        const mapHeight = inner.scrollHeight;
        const artifactX = (pos.x / 100) * mapWidth;
        const artifactY = (pos.y / 100) * mapHeight;

        // The visible area for the map is the left half of the viewport (panel is on the right)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const mapVisibleWidth = viewportWidth / 2; // left half

        // Scroll so the artifact is centered in the left half
        const scrollLeft = artifactX - (mapVisibleWidth / 2);
        const scrollTop = artifactY - (viewportHeight / 2);

        container.scrollTo({
            left: Math.max(0, scrollLeft),
            top: Math.max(0, scrollTop),
            behavior: 'smooth',
        });
    }, [artifactPositions]);

    // When an artifact is selected, scroll to it
    useEffect(() => {
        if (selectedArtifact) {
            // Small delay to let the panel animate in
            const timer = setTimeout(() => scrollToArtifact(selectedArtifact), 100);
            return () => clearTimeout(timer);
        }
    }, [selectedArtifact, scrollToArtifact]);

    // Close popup when clicking on empty map area
    const handleMapBackgroundClick = (e: React.MouseEvent) => {
        if (
            (e.target as HTMLElement).closest('[data-artifact-pin]') ||
            (e.target as HTMLElement).closest('[data-popup]')
        ) return;
        setSelectedArtifact(null);
    };

    // Get the spotlight position for the dark overlay
    const selectedPos = selectedArtifact ? artifactPositions[selectedArtifact.id] : null;

    return (
        <div
            ref={mapContainerRef}
            className="relative w-full h-full overflow-auto"
            onClick={handleMapBackgroundClick}
            style={{ cursor: selectedArtifact ? 'default' : 'grab' }}
        >
            {/* ====== MAP INNER: extra-wide so the user scrolls around ====== */}
            <div ref={mapInnerRef} className="relative inline-block" style={{ minWidth: '2200px' }}>
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
                        {/* Spotlight radial gradient for selected artifact */}
                        {selectedPos && (
                            <radialGradient id="spotlight-grad" cx={`${selectedPos.x}%`} cy={`${selectedPos.y}%`} r="12%" gradientUnits="userSpaceOnUse"
                                fx={`${selectedPos.x}%`} fy={`${selectedPos.y}%`}
                            >
                                <stop offset="0%" stopColor="black" stopOpacity="0" />
                                <stop offset="60%" stopColor="black" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="black" stopOpacity="0.75" />
                            </radialGradient>
                        )}
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
                                {/* Dark fog layer — nearly opaque */}
                                <polygon
                                    points={points}
                                    fill="rgba(0, 0, 0, 0.95)"
                                    filter="url(#fog-blur)"
                                    className="fog-polygon"
                                />
                                {/* Smoky texture layer */}
                                <polygon
                                    points={points}
                                    fill="rgba(5, 2, 10, 0.7)"
                                    filter="url(#fog-smoke)"
                                    className="fog-polygon"
                                />
                            </g>
                        );
                    })}

                    {/* ====== FULL-MAP DARK OVERLAY with spotlight cutout ====== */}
                    {selectedArtifact && selectedPos && (
                        <rect
                            x="0" y="0" width="100" height="100"
                            fill="url(#spotlight-grad)"
                            style={{ transition: 'opacity 0.4s ease' }}
                        />
                    )}
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
                                background: selectedPos
                                    ? `radial-gradient(circle at ${selectedPos.x}% ${selectedPos.y}%, transparent 3%, rgba(0,0,0,0.7) 15%)`
                                    : 'rgba(0,0,0,0.7)',
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
                                        width: isSelected ? '22px' : '14px',
                                        height: isSelected ? '22px' : '14px',
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

                                {/* Pulsing ring for selected artifact */}
                                {isSelected && (
                                    <div
                                        className="absolute"
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: '2px solid rgba(255,215,0,0.5)',
                                            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                                        }}
                                    />
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

            {/* ====== SIDE PANEL — slides in from the right, takes half the page ====== */}
            <AnimatePresence>
                {selectedArtifact && (
                    <>
                        {/* Clickable backdrop on the map side to close */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60]"
                            onClick={() => setSelectedArtifact(null)}
                            style={{ background: 'transparent' }}
                        />

                        {/* Side panel */}
                        <motion.div
                            data-popup
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 z-[70] w-[50vw] h-full overflow-y-auto"
                            style={{
                                background: 'linear-gradient(180deg, #0a0e1a 0%, #111827 30%, #0f172a 100%)',
                                borderLeft: '1px solid rgba(255, 215, 0, 0.2)',
                                boxShadow: '-10px 0 60px rgba(0,0,0,0.6), -2px 0 20px rgba(255,215,0,0.08)',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Hero Image */}
                            <div className="relative h-[40vh] overflow-hidden">
                                <motion.img
                                    src={getAssetUrl(selectedArtifact.image)}
                                    alt={isAr ? selectedArtifact.nameAr : selectedArtifact.name}
                                    className="w-full h-full object-cover"
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/40 to-transparent" />

                                {/* Close button */}
                                <button
                                    onClick={() => setSelectedArtifact(null)}
                                    className="absolute top-5 right-5 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 hover:scale-110 transition-all z-20 border border-white/15"
                                >
                                    <X size={18} />
                                </button>

                                {/* Title overlay */}
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <div className="text-xs font-bold text-amber-400 mb-2 tracking-wider uppercase drop-shadow-md flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                                        {isAr ? hallsData.find(h => h.id === selectedArtifact.hallId)?.nameAr : hallsData.find(h => h.id === selectedArtifact.hallId)?.name}
                                    </div>
                                    <h3 className="text-3xl font-bold leading-tight drop-shadow-lg">
                                        {isAr ? selectedArtifact.nameAr : selectedArtifact.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Info Content */}
                            <div className="p-6 lg:p-8 space-y-6">
                                {/* Fun Fact Card */}
                                <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: 'rgba(255, 215, 0, 0.04)' }}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lightbulb className="text-amber-400" size={18} />
                                        <p className="text-amber-400 font-bold text-sm uppercase tracking-wider">
                                            {t('funFact', 'Fun Fact')}
                                        </p>
                                    </div>
                                    <p className="text-gray-200 font-medium text-base leading-relaxed">
                                        {isAr ? selectedArtifact.funFactAr : selectedArtifact.funFact}
                                    </p>
                                </div>

                                {/* Description */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                        {t('description', 'Description')}
                                    </h4>
                                    <p className="text-base text-gray-300 leading-relaxed font-medium">
                                        {isAr ? selectedArtifact.descriptionAr : selectedArtifact.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Pulse animation keyframes */}
            <style>{`
                @keyframes ping {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
                    75%, 100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default MuseumMap;
