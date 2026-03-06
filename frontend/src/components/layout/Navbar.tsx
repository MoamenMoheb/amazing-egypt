import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Home as HomeIcon, Trophy, BookOpen, Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMuseum } from '../../context/MuseumContext';

const Navbar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { badges, isParentMode, toggleParentMode } = useMuseum();

    useEffect(() => {
        document.dir = 'rtl';
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 p-4 font-sans">
            <div className="max-w-5xl mx-auto bg-[#0A192F]/90 backdrop-blur-md rounded-full shadow-lg border border-[#FFD700]/30 px-4 md:px-6 py-3 flex justify-between items-center shadow-[0_4px_30px_rgba(255,215,0,0.1)]">
                <Link to="/" className="flex items-center">
                    <img src="/logo.png" alt={t('title')} className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                </Link>

                <div className="flex gap-1 md:gap-3">
                    <NavLink to="/" icon={<HomeIcon size={18} />} label={t('nav.home')} active={location.pathname === '/'} />
                    <NavLink to="/halls" icon={<Landmark size={18} />} label={t('nav.halls')} active={location.pathname === '/halls'} />
                    <NavLink to="/map" icon={<Map size={18} />} label={t('nav.map')} active={location.pathname === '/map' || location.pathname.startsWith('/hall/')} />
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
                                ? 'bg-[#3498DB] text-white shadow-[0_0_10px_rgba(52,152,219,0.5)]'
                                : 'text-[#85C1E9] hover:bg-[#1A5276]/50'
                            }`}
                        title={t('parentMode')}
                    >
                        <BookOpen size={16} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label, active, badge }: { to: string; icon: React.ReactNode; label: string; active?: boolean; badge?: number }) => (
    <Link
        to={to}
        className={`relative flex items-center gap-1 md:gap-2 font-bold px-2 md:px-3 py-2 rounded-full transition-all text-sm ${active
                ? 'bg-[#FFD700] text-[#020C1B] shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                : 'text-[#E5E7EB] hover:text-[#FFD700] hover:bg-[#1A5276]/40'
            }`}
    >
        {icon}
        <span className="hidden md:inline">{label}</span>
        {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#E74C3C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {badge}
            </span>
        )}
    </Link>
);

export default Navbar;
