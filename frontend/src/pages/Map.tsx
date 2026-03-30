import MuseumMap from '../components/MuseumMap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Map = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#020C1B] selection:bg-[#FFD700] selection:text-[#0A192F] pt-0 pb-10 px-4 flex flex-col items-center">

            {/* Background elements to match Halls/Home */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#020C1B] via-[#010612]/90 to-[#000000]" />
                <div className="absolute top-10 right-1/4 w-60 h-60 bg-yellow-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse" />
            </div>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFD700] to-[orange] bg-clip-text text-transparent drop-shadow-md mb-8 inline-flex items-center gap-4 relative z-10"
            >
                <span className="text-4xl md:text-5xl drop-shadow-none">🗺️</span>
                {t('nav.map')}
            </motion.h1>

            <div className="relative z-10 w-full flex justify-center">
                <MuseumMap />
            </div>
        </div>
    );
};

export default Map;
