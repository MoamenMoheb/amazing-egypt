import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useMascot } from '../context/MascotContext';
import { useTranslation } from 'react-i18next';
import { getAssetUrl } from '../utils/getAssetUrl';

type CharacterMood = 'idle' | 'welcome' | 'pointing' | 'celebration' | 'confused' | 'thinking' | 'idea' | 'speaking';

const REACTION_IMAGES: Record<string, string> = {
    idle: getAssetUrl('/character/New-Mascot1.png'),
    welcome: getAssetUrl('/character/New-Mascot3.png'),
    pointing: getAssetUrl('/character/New-Mascot5.png'),
    celebration: getAssetUrl('/character/New-Mascot7.png'),
    confused: getAssetUrl('/character/New-Mascot9.png'),
    thinking: getAssetUrl('/character/New-Mascot11.png'),
    idea: getAssetUrl('/character/New-Mascot8.png'),
    speaking: getAssetUrl('/character/New-Mascot1.png'),
};

interface CharacterProps {
    size?: number;
    inline?: boolean;
    mood?: string;
    message?: string;
    playIntroVideo?: boolean;
}

const Character = ({
    size = 260,
    inline = false,
    mood: propMood,
    message: propMessage,
    playIntroVideo = false,
}: CharacterProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { currentReaction: contextReaction, message: contextMessage } = useMascot();
    const [showMessage, setShowMessage] = useState(false);
    const [displayedText, setDisplayedText] = useState('');

    const currentReaction = propMood || contextReaction;
    const message = propMessage || contextMessage;

    const activeMascotImg = REACTION_IMAGES[currentReaction] || REACTION_IMAGES['idle'];

    // Typewriter text effect
    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setDisplayedText('');
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < message.length) {
                    setDisplayedText(message.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 28);
            return () => { clearInterval(typeInterval); };
        } else {
            setShowMessage(false);
            setDisplayedText('');
        }
    }, [message]);
    
    // Manual play trigger and initial load handling
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.warn("Video play failed:", error);
            });
        }
    }, []);

    const handleHover = () => {
        if (videoRef.current) {
            if (videoRef.current.ended) {
                videoRef.current.currentTime = 0;
            }
            videoRef.current.play().catch(error => {
                console.warn("Video replay failed:", error);
            });
        }
    };

    // Framer Motion Variants for Mascot
    const mascotVariants: Variants = {
        idle: {
            y: [0, -8, 0],
            rotate: [0, 1, -1, 0],
            transition: {
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
            }
        },
        talking: {
            y: [0, -3, 0, -2, 0],
            scale: [1, 1.02, 1, 1.01, 1],
            rotate: [0, 2, -1, 1, 0],
            transition: {
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        },
        waving: {
            y: [0, -10, 0],
            rotate: [0, 8, -4, 5, 0],
            scale: [1, 1.05, 1],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        },
        excited: {
            y: [0, -30, 0, -15, 0],
            scale: [1, 1.05, 0.95, 1.02, 1],
            rotate: [0, -5, 5, -2, 0],
            transition: {
                duration: 0.5,
                repeat: Infinity,
                ease: 'easeOut'
            }
        },
        thinking: {
            y: [0, -5, 0, -5, 0],
            rotate: [0, -3, -3, -3, 0],
            scale: [1, 1.01, 1.01, 1.01, 1],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        },
        pointing: {
            y: [0, -8, 0],
            x: [0, 5, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.03, 1],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        }
    };

    return (
        <div className={`${inline ? 'relative w-full' : 'fixed bottom-4 right-4 z-[9999]'} flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 max-w-[100vw] px-4 md:px-0`} dir="ltr">
            
            {/* Speech Bubble */}
            <AnimatePresence mode="wait">
                {showMessage && displayedText && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-gradient-to-br from-white to-amber-50 p-5 md:p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] relative z-10 w-[min(90vw,400px)] md:w-auto md:max-w-[320px] border-[3px] border-[#F59E0B]"
                    >
                        <p className="text-[#020C1B] font-bold text-sm leading-relaxed text-right md:text-lg" dir="rtl">{displayedText}</p>
                        
                        {/* Tail pointing down (mobile) */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 z-10 md:hidden"
                            style={{ borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '16px solid #F59E0B' }}
                        />
                        <div className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-0 h-0 z-10 md:hidden"
                            style={{ borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: '11px solid white' }}
                        />

                        {/* Tail pointing right (desktop) */}
                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-0 h-0 z-10 hidden md:block"
                            style={{ borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '16px solid #F59E0B' }}
                        />
                        <div className="absolute top-1/2 -right-[11px] -translate-y-1/2 w-0 h-0 z-10 hidden md:block"
                            style={{ borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '11px solid white' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Character Container */}
            <div className="relative flex justify-center items-center shrink-0" style={{ width: `min(${size}px, 80vw)`, height: `min(${size}px, 80vw)` }}>
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[50%]"
                    style={{ width: '45%', height: '6%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)' }}
                />

                {/* Character image or Video */}
                {(playIntroVideo || currentReaction === 'speaking') ? (
                    <motion.div 
                        className="absolute inset-0 w-full h-full z-10 cursor-pointer" 
                        style={{ mixBlendMode: 'screen' }}
                        onMouseEnter={handleHover}
                        animate={{ 
                            y: [0, -15, 0],
                        }}
                        transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-contain relative z-10"
                            style={{ mixBlendMode: 'screen' }}
                        >
                            <source src={getAssetUrl('/character/speaking.webm')} type="video/webm" />
                            <source src={getAssetUrl('/character/speaking.mp4')} type="video/mp4" />
                        </video>
                    </motion.div>
                ) : (
                    <motion.img
                        src={activeMascotImg}
                        alt="Pharaoh Robot - Your Museum Guide"
                        className="absolute inset-0 w-full h-full object-contain z-10 cursor-pointer select-none"
                        style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.12))' }}
                        draggable={false}
                        variants={mascotVariants}
                        initial="idle"
                        animate={currentReaction === 'thinking' ? 'thinking' : currentReaction === 'celebration' ? 'excited' : currentReaction === 'pointing' ? 'pointing' : 'idle'}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.93 }}
                    />
                )}

                {/* Sparkles for excited/celebrate */}
                {currentReaction === 'celebration' && (
                    <>
                        <motion.span className="absolute -top-4 left-2 text-2xl z-20 pointer-events-none"
                            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.4, 0.3], rotate: [0, 200, 400], y: [0, -20, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }} />
                        <motion.span className="absolute top-4 -right-2 text-xl z-20 pointer-events-none"
                            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.3, 0.3], y: [0, -15, 0] }}
                            transition={{ duration: 1.0, delay: 0.3, repeat: Infinity, repeatDelay: 1 }} />
                        <motion.span className="absolute top-1/3 -left-4 text-xl z-20 pointer-events-none"
                            animate={{ opacity: [0, 1, 0], x: [0, -12, 0] }}
                            transition={{ duration: 1.3, delay: 0.6, repeat: Infinity, repeatDelay: 1 }} />
                        <motion.span className="absolute -top-2 right-1/4 text-xl z-20 pointer-events-none"
                            animate={{ opacity: [0, 1, 0], y: [0, -25, 0] }}
                            transition={{ duration: 1.1, delay: 0.15, repeat: Infinity, repeatDelay: 1 }} />
                    </>
                )}

                {/* Thinking dots */}
                {currentReaction === 'thinking' && !showMessage && (
                    <div className="absolute -top-6 right-2 flex gap-1.5 z-20">
                        <motion.div className="w-2.5 h-2.5 rounded-full bg-amber-400"
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
                            transition={{ duration: 1.2, delay: 0, repeat: Infinity }} />
                        <motion.div className="w-3.5 h-3.5 rounded-full bg-amber-400"
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
                            transition={{ duration: 1.2, delay: 0.3, repeat: Infinity }} />
                        <motion.div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold text-white shadow-md"
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
                            transition={{ duration: 1.2, delay: 0.6, repeat: Infinity }}>?</motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Character;

