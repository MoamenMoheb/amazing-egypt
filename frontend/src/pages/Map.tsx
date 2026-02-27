import MuseumMap from '../components/MuseumMap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Map = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pt-24 pb-10 px-4 flex flex-col items-center">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-amber-700 mb-8"
            >
                🗺️ {t('nav.map')}
            </motion.h1>
            <MuseumMap />
        </div>
    );
};

export default Map;
