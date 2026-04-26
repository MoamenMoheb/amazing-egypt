import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { getAssetUrl } from '../utils/getAssetUrl';
import MuseumMap from '../components/MuseumMap';

const Map = () => {
    return (
        <div className="h-screen w-screen bg-[#020C1B] overflow-hidden relative flex flex-col">
            {/* Top Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-4 py-1.5 bg-[#0A192F]/90 backdrop-blur-md border-b border-[#FFD700]/15 shrink-0">
                <Link
                    to="/"
                    className="flex items-center gap-2 group transition-all"
                    title="العودة للرئيسية"
                >
                    <img
                        src={getAssetUrl('/images/logo.png')}
                        alt="GEM Kids"
                        className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)] group-hover:drop-shadow-[0_0_16px_rgba(255,215,0,0.7)] group-hover:scale-105 transition-all duration-300"
                    />
                </Link>

                <div className="flex items-center gap-2 text-sm font-bold">
                    <MapPin size={16} className="text-[#FFD700]" />
                    <span className="text-[#FFD700]">خريطة المتحف</span>
                </div>
            </nav>

            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#020C1B] via-[#010612]/90 to-[#000000]" />
                <div className="absolute top-10 right-1/4 w-60 h-60 bg-yellow-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse" />
            </div>

            <div className="relative z-10 w-full flex-1 overflow-hidden">
                <MuseumMap />
            </div>
        </div>
    );
};

export default Map;
