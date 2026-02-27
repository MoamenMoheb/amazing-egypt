import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Home as HomeIcon, Trophy, Languages, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMuseum } from '../../context/MuseumContext';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { badges, isParentMode, toggleParentMode } = useMuseum();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    useEffect(() => {
        document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    }, [i18n.language]);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 p-4 font-sans">
            <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-full shadow-lg border-2 border-amber-200 px-4 md:px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl md:text-2xl font-bold text-amber-700 flex items-center gap-2">
                    <span className="text-2xl md:text-3xl">🏛️</span>
                    <span className="hidden sm:inline">{t('title')}</span>
                </Link>

                <div className="flex gap-1 md:gap-3">
                    <NavLink to="/" icon={<HomeIcon size={18} />} label={t('nav.home')} active={location.pathname === '/'} />
                    <NavLink to="/map" icon={<Map size={18} />} label={t('nav.map')} active={location.pathname === '/map' || location.pathname.startsWith('/hall')} />
                    <NavLink
                        to="/badges"
                        icon={<Trophy size={18} />}
                        label={t('nav.badges')}
                        active={location.pathname === '/badges'}
                        badge={badges.length > 0 ? badges.length : undefined}
                    />
                </div>

                <div className="flex gap-1 md:gap-2">
                    <button
                        onClick={toggleParentMode}
                        className={`p-2 rounded-full text-sm transition flex items-center gap-1 ${isParentMode
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        title={t('parentMode')}
                    >
                        <BookOpen size={16} />
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="bg-amber-500 text-white font-bold px-3 py-1 rounded-full text-sm hover:bg-amber-600 transition flex items-center gap-1 shadow-sm"
                    >
                        <Languages size={14} />
                        {i18n.language === 'en' ? 'AR' : 'EN'}
                    </button>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label, active, badge }: { to: string; icon: React.ReactNode; label: string; active?: boolean; badge?: number }) => (
    <Link
        to={to}
        className={`relative flex items-center gap-1 md:gap-2 font-bold px-2 md:px-3 py-2 rounded-full transition-colors text-sm ${active
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
            }`}
    >
        {icon}
        <span className="hidden md:inline">{label}</span>
        {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {badge}
            </span>
        )}
    </Link>
);

export default Navbar;
