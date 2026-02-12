import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const locations = [
    { id: 'cairo', x: 55, y: 25, label: 'Cairo', color: '#FFD700' },
    { id: 'alex', x: 45, y: 15, label: 'Alexandria', color: '#00A8E8' },
    { id: 'luxor', x: 60, y: 65, label: 'Luxor', color: '#FF6B6B' },
    { id: 'aswan', x: 62, y: 80, label: 'Aswan', color: '#E67E22' },
    { id: 'hurghada', x: 75, y: 45, label: 'Hurghada', color: '#1ABC9C' },
];

const InteractiveMap = () => {
    const { t } = useTranslation();
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

    const handleLocationClick = (id: string) => {
        setSelectedLocation(id === selectedLocation ? null : id);
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto aspect-[3/4] bg-[#ADD8E6] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            {/* Background (Sea/Land) - Simplified */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Land (Egypt Shape Approximation) */}
                <path d="M0 0 H100 V100 H0 Z" fill="#87CEEB" /> {/* Sea base */}
                <path d="M20 100 L20 20 L40 10 L80 10 L80 100 Z" fill="#F4D03F" /> {/* Rough Egypt desert base */}

                {/* Nile River */}
                <path d="M55 100 C 55 80, 60 70, 50 25 L 45 15" stroke="#3498DB" strokeWidth="2" fill="none" />
                <path d="M50 25 L 55 15" stroke="#3498DB" strokeWidth="2" fill="none" />
            </svg>

            {/* Interactive Points */}
            {locations.map((loc) => (
                <motion.div
                    key={loc.id}
                    className="absolute cursor-pointer"
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLocationClick(loc.id)}
                >
                    <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-lg animate-bounce"
                        style={{ backgroundColor: loc.color }}
                    ></div>
                    <span className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white/80 px-2 rounded-full text-xs font-bold text-gray-800 pointer-events-none whitespace-nowrap">
                        {loc.label}
                    </span>
                </motion.div>
            ))}

            {/* Popup Info */}
            <AnimatePresence>
                {selectedLocation && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border-2 border-brand-secondary z-10"
                    >
                        <h2 className="text-2xl font-bold text-brand-secondary mb-2 capitalize">
                            {locations.find(l => l.id === selectedLocation)?.label}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {t(`locations.${selectedLocation}.desc`, 'A wonderful place to visit in Egypt! Features ancient history and fun activities.')}
                        </p>
                        <button
                            onClick={() => setSelectedLocation(null)}
                            className="bg-brand-accuracy text-white px-4 py-2 rounded-full font-bold bg-brand-accent hover:bg-red-500"
                        >
                            Close
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InteractiveMap;
