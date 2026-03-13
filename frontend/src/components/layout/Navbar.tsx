import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Home as HomeIcon, Trophy, Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMuseum } from '../../context/MuseumContext';

import { useMascot } from '../../context/MascotContext';

const Navbar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { badges } = useMuseum();
    const { triggerReaction } = useMascot();

    useEffect(() => {
        document.dir = 'rtl';
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 p-4 font-sans justify-center flex">
            <div className="bg-[#0A192F]/90 backdrop-blur-md rounded-full shadow-lg border border-[#FFD700]/30 px-4 md:px-6 py-3 flex justify-center items-center shadow-[0_4px_30px_rgba(255,215,0,0.1)] inline-block">
                <div className="flex gap-2 md:gap-4">
                    <NavLink to="/" icon={<HomeIcon size={18} />} label={t('nav.home')} active={location.pathname === '/'} triggerReaction={triggerReaction} />
                    <NavLink to="/halls" icon={<Landmark size={18} />} label={t('nav.halls')} active={location.pathname === '/halls'} triggerReaction={triggerReaction} />
                    <NavLink to="/map" icon={<Map size={18} />} label={t('nav.map')} active={location.pathname === '/map' || location.pathname.startsWith('/hall/')} triggerReaction={triggerReaction} />
                    <NavLink
                        to="/badges"
                        icon={<Trophy size={18} />}
                        label={t('nav.badges')}
                        active={location.pathname === '/badges'}
                        badge={badges.length > 0 ? badges.length : undefined}
                        triggerReaction={triggerReaction}
                    />
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label, active, badge, triggerReaction }: { to: string; icon: React.ReactNode; label: string; active?: boolean; badge?: number; triggerReaction: any }) => (
    <Link
        to={to}
        onPointerEnter={() => triggerReaction('pointing', `Go to ${label}`, 2000)}
        onPointerLeave={() => triggerReaction('idle')}
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
