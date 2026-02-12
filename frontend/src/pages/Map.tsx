import InteractiveMap from '../components/InteractiveMap';
import { useTranslation } from 'react-i18next';

const Map = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-brand-light pt-24 pb-10 px-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-brand-primary mb-8 animate-bounce-slow">{t('nav.map')}</h1>
            <InteractiveMap />
        </div>
    )
}
export default Map
