import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMascot } from '../../context/MascotContext';

const Navbar = () => {
    const { triggerReaction } = useMascot();

    useEffect(() => {
        document.dir = 'rtl';
    }, []);

    return (
        <nav className="w-full z-50 font-sans pointer-events-none relative">
            <div className="flex justify-center items-start w-full pt-2">
                <Link 
                    to="/" 
                    className="flex flex-col items-center pointer-events-auto" 
                    onPointerEnter={() => triggerReaction('pointing', `Welcome back to Amazing Egypt!`, 2000)} 
                    onPointerLeave={() => triggerReaction('idle')}
                >
                    <img 
                        src="/gemkids-logo-new.png" 
                        alt="GEM Kids" 
                        className="h-[320px] md:h-[448px] lg:h-[576px] w-auto max-w-[95vw] object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:drop-shadow-[0_0_35px_rgba(255,215,0,0.9)] transition-all duration-300 transform hover:scale-105" 
                    />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
