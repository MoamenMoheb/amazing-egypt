import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element
        const audio = new Audio('https://freepd.com/music/Desert%20Caravan.mp3');
        audio.loop = true;
        audio.volume = 0.2; // Soft background volume
        audioRef.current = audio;

        // Try to autoplay
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(() => {
                // Autoplay was blocked
                setIsPlaying(false);
            });
        }

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            onClick={togglePlay}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-[#020C1B]/80 backdrop-blur-md rounded-full border border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.2)] flex items-center justify-center text-xl hover:bg-[#1A5276]/80 hover:scale-110 hover:border-[#FFD700] transition-all duration-300 group cursor-pointer"
            title={isPlaying ? "Mute Music" : "Play Music"}
        >
            {isPlaying ? '🔊' : '🔇'}
            <span className="absolute left-14 bg-[#0A192F] text-[#FFD700] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#FFD700]/30 pointer-events-none">
                {isPlaying ? 'Mute Music' : 'Play Music'}
            </span>
        </motion.button>
    );
};

export default BackgroundMusic;
