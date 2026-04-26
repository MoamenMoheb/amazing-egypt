import MuseumMap from '../components/MuseumMap';

const Map = () => {
    return (
        <div className="h-screen w-screen bg-[#020C1B] overflow-hidden relative">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#020C1B] via-[#010612]/90 to-[#000000]" />
                <div className="absolute top-10 right-1/4 w-60 h-60 bg-yellow-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse" />
            </div>

            <div className="relative z-10 w-full h-full">
                <MuseumMap />
            </div>
        </div>
    );
};

export default Map;
