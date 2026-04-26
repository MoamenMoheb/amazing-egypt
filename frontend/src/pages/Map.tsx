import { Link } from 'react-router-dom';
import { getAssetUrl } from '../utils/getAssetUrl';
import MuseumMap from '../components/MuseumMap';

const Map = () => {
    return (
        <div className="h-screen w-screen bg-[#020C1B] overflow-hidden relative">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#020C1B] via-[#010612]/90 to-[#000000]" />
                <div className="absolute top-10 right-1/4 w-60 h-60 bg-yellow-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse" />
            </div>

            {/* Map takes the full screen */}
            <div className="relative z-10 w-full h-full">
                <MuseumMap />
            </div>

            {/* Floating logo — top-left corner, always visible */}
            <Link
                to="/"
                className="fixed top-4 left-4 z-[80] group"
                title="العودة للرئيسية"
            >
                <div className="bg-[#0A192F]/70 backdrop-blur-md rounded-2xl p-2 border border-[#FFD700]/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)] group-hover:bg-[#0A192F]/90 group-hover:border-[#FFD700]/50 group-hover:shadow-[0_4px_30px_rgba(255,215,0,0.15)] transition-all duration-300 group-active:scale-95">
                    <img
                        src={getAssetUrl('/images/logo.png')}
                        alt="GEM Kids — Home"
                        className="h-12 w-auto object-contain drop-shadow-[0_0_6px_rgba(255,215,0,0.3)] group-hover:drop-shadow-[0_0_14px_rgba(255,215,0,0.6)] group-hover:scale-105 transition-all duration-300"
                    />
                </div>
            </Link>
        </div>
    );
};

export default Map;
