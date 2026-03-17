import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useMascot } from '../context/MascotContext';



const REACTION_IMAGES: Record<string, string> = {
    idle: '/character/New-Mascot1.png',
    welcome: '/character/New-Mascot3.png',
    pointing: '/character/New-Mascot5.png',
    celebration: '/character/New-Mascot7.png',
    confused: '/character/New-Mascot9.png',
    thinking: '/character/New-Mascot11.png',
    idea: '/character/New-Mascot8.png',
};

interface CharacterProps {
    size?: number;
    inline?: boolean;
    mood?: string;
    message?: string;
}

const Character = ({
    size = 260,
    inline = false,
    mood: propMood,
    message: propMessage,
}: CharacterProps) => {
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
        <div className={`${inline ? 'relative' : 'fixed bottom-4 right-4 z-50'} flex items-center justify-center gap-10 md:gap-16`} dir="ltr">
            
            {/* Speech Bubble - On the left of the mascot */}
            <AnimatePresence>
                {showMessage && displayedText && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="bg-gradient-to-br from-white to-amber-50 p-6 rounded-3xl shadow-2xl relative z-10 max-w-[280px]"
                        style={{ border: '3px solid #F59E0B' }}
                    >
                        <p className="text-[#020C1B] font-bold text-base leading-relaxed text-right md:text-lg" dir="rtl">{displayedText}</p>
                        
                        {/* Tail pointing right towards mascot */}
                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-0 h-0 z-10"
                            style={{ borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '16px solid #F59E0B' }}
                        />
                        <div className="absolute top-1/2 -right-[11px] -translate-y-1/2 w-0 h-0 z-10"
                            style={{ borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '11px solid white' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Character Container */}
            <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[50%]"
                    style={{ width: size * 0.45, height: size * 0.06, background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)' }}
                />

                {/* Character image */}
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

