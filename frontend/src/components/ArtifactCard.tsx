import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Artifact } from '../data/artifacts';
import { useMuseum } from '../context/MuseumContext';

interface ArtifactCardProps {
    artifact: Artifact;
    hallId: string;
    index: number;
}

const ArtifactCard = ({ artifact, index }: ArtifactCardProps) => {
    const { viewedArtifacts } = useMuseum();
    const isViewed = viewedArtifacts.includes(artifact.id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
        >
            <Link to={`/artifact/${artifact.id}`} className="block group">
                <div className="relative bg-[#0A192F]/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(10,25,47,0.5)] border-3 border-transparent group-hover:border-[#FFD700] transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(255,215,0,0.25)]"
                    style={{ borderWidth: '3px' }}
                >
                    {/* Image */}
                    <div className="h-48 overflow-hidden relative">
                        <img
                            src={artifact.image}
                            alt={artifact.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Viewed badge */}
                        {isViewed && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                ✓ Viewed
                            </div>
                        )}

                        {/* Icon */}
                        <div className="absolute top-3 left-3 text-3xl drop-shadow-lg">
                            {artifact.icon}
                        </div>

                        {/* Name overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-xl font-bold text-white drop-shadow-lg">{artifact.name}</h3>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-4">
                        <p className="text-[#E5E7EB] text-sm line-clamp-2 leading-relaxed">{artifact.description}</p>
                        <div className="mt-3 flex justify-between items-center text-[#F39C12] font-bold group-hover:text-[#FFD700] transition-colors pt-2 border-t border-[#1A5276]">
                            <span className="text-xs uppercase tracking-wider">
                                Tap to Explore
                            </span>
                            <motion.span
                                className="text-lg"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                →
                            </motion.span>
                        </div>
                    </div>

                    {/* Sparkle hover overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 text-xl animate-ping">✨</div>
                        <div className="absolute top-1/3 right-1/4 text-sm animate-ping" style={{ animationDelay: '0.3s' }}>⭐</div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ArtifactCard;
