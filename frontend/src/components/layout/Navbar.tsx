import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Home as HomeIcon, Landmark, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();

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
            <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-full shadow-lg border-2 border-white px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-brand-secondary flex items-center gap-2">
                    <span className="text-3xl">🏺</span> {t('title', 'Amazing Egypt')}
                </Link>

                <div className="flex gap-2 md:gap-4">
                    <NavLink to="/" icon={<HomeIcon size={20} />} label={t('nav.home')} active={location.pathname === '/'} />
                    <NavLink to="/map" icon={<Map size={20} />} label={t('nav.map')} active={location.pathname === '/map'} />
                    <NavLink to="/sites" icon={<Landmark size={20} />} label={t('nav.sites')} active={location.pathname === '/sites'} />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={toggleLanguage}
                        className="bg-brand-primary text-brand-dark font-bold px-3 py-1 rounded-full text-sm hover:bg-yellow-400 transition flex items-center gap-1"
                    >
                        <Languages size={16} />
                        {i18n.language === 'en' ? 'AR' : 'EN'}
                    </button>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active?: boolean }) => (
    <Link
        to={to}
        className={`flex items-center gap-2 font-bold px-3 py-2 rounded-full transition-colors ${active ? 'bg-brand-accent text-white' : 'text-brand-dark hover:text-brand-accent hover:bg-brand-light'
            }`}
    >
        {icon}
        <span className="hidden sm:inline">{label}</span>
    </Link>
);

export default Navbar;
