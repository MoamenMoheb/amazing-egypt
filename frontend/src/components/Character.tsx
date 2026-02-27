import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ======== SPRITE PATHS ======== */
const S = {
    normal: '/character/amun-normal.png',
    blink: '/character/amun-blink.png',
    eyesHalf: '/character/amun-eyes-half.png',
    talkMid: '/character/amun-talk-mid.png',
    talkWide: '/character/amun-talking.png',
    waveDown: '/character/amun-wave-down.png',
    point: '/character/amun-point.png',
    jumpStart: '/character/amun-jump-start.png',
    jumpTop: '/character/amun-excited.png',
    thinking: '/character/amun-thinking.png',
};

/* ======== ANIMATION SEQUENCES (play once, then hold last frame) ======== */
const SEQUENCES = {
    idle: [
        { src: S.normal, dur: 800 },
        { src: S.eyesHalf, dur: 60 },
        { src: S.blink, dur: 100 },
        { src: S.eyesHalf, dur: 60 },
        { src: S.normal, dur: 0 }, // final frame
    ],

    waving: [
        { src: S.normal, dur: 350 },
        { src: S.waveDown, dur: 350 },
        { src: S.normal, dur: 350 },
        { src: S.waveDown, dur: 350 },
        { src: S.normal, dur: 350 },
        { src: S.waveDown, dur: 300 },
        { src: S.normal, dur: 0 }, // final frame
    ],

    talking: [
        { src: S.normal, dur: 100 },
        { src: S.talkMid, dur: 90 },
        { src: S.talkWide, dur: 120 },
        { src: S.talkMid, dur: 90 },
        { src: S.normal, dur: 70 },
        { src: S.talkMid, dur: 90 },
        { src: S.talkWide, dur: 110 },
        { src: S.talkMid, dur: 80 },
        { src: S.point, dur: 180 },
        { src: S.talkMid, dur: 90 },
        { src: S.talkWide, dur: 120 },
        { src: S.talkMid, dur: 80 },
        { src: S.normal, dur: 0 }, // final frame
    ],

    excited: [
        { src: S.normal, dur: 180 },
        { src: S.jumpStart, dur: 180 },
        { src: S.jumpTop, dur: 450 },
        { src: S.jumpStart, dur: 140 },
        { src: S.normal, dur: 180 },
        { src: S.jumpStart, dur: 180 },
        { src: S.jumpTop, dur: 500 },
        { src: S.jumpStart, dur: 140 },
        { src: S.normal, dur: 200 },
        { src: S.eyesHalf, dur: 60 },
        { src: S.blink, dur: 100 },
        { src: S.eyesHalf, dur: 60 },
        { src: S.jumpTop, dur: 0 }, // final frame: stay excited
    ],

    thinking: [
        { src: S.normal, dur: 400 },
        { src: S.eyesHalf, dur: 70 },
        { src: S.blink, dur: 100 },
        { src: S.eyesHalf, dur: 70 },
        { src: S.thinking, dur: 0 }, // final frame: stay thinking
    ],
};


interface CharacterProps {
    message?: string;
    mood?: 'happy' | 'excited' | 'thinking' | 'waving';
    size?: number;
    inline?: boolean;
    onCelebrate?: boolean;
}

const Character = ({
    message,
    mood = 'happy',
    size = 260,
    inline = false,
    onCelebrate = false,
}: CharacterProps) => {
    const [showMessage, setShowMessage] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [isTalking, setIsTalking] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(S.normal);
    const [animDone, setAnimDone] = useState(false);
    const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const frameIdx = useRef(0);

    // Determine active sequence key
    const activeMood = onCelebrate ? 'excited' : isTalking ? 'talking' : mood === 'happy' ? 'idle' : mood;

    // Play sequence ONCE then stop
    const runFrame = useCallback((seqKey: string) => {
        const seq = SEQUENCES[seqKey as keyof typeof SEQUENCES] || SEQUENCES.idle;
        const idx = frameIdx.current;

        if (idx >= seq.length) {
            // Animation finished — hold the last frame
            setAnimDone(true);
            return;
        }

        const frame = seq[idx];
        setCurrentFrame(frame.src);
        frameIdx.current = idx + 1;

        if (frame.dur === 0) {
            // dur=0 means this is the final frame — stop here
            setAnimDone(true);
            return;
        }

        animRef.current = setTimeout(() => runFrame(seqKey), frame.dur);
    }, []);

    // Start animation once when mood changes
    useEffect(() => {
        frameIdx.current = 0;
        setAnimDone(false);
        if (animRef.current) clearTimeout(animRef.current);

        // For talking, keep looping while still talking
        if (activeMood === 'talking') {
            const runTalkLoop = () => {
                const seq = SEQUENCES.talking;
                const idx = frameIdx.current % seq.length;
                const frame = seq[idx];
                setCurrentFrame(frame.src);
                frameIdx.current = idx + 1;
                const dur = frame.dur === 0 ? 100 : frame.dur;
                animRef.current = setTimeout(runTalkLoop, dur);
            };
            runTalkLoop();
        } else {
            runFrame(activeMood);
        }

        return () => {
            if (animRef.current) clearTimeout(animRef.current);
        };
    }, [activeMood, runFrame]);

    // Stop talk loop when talking ends
    useEffect(() => {
        if (!isTalking && animRef.current) {
            // Let it settle to normal
            setCurrentFrame(S.normal);
            setAnimDone(true);
        }
    }, [isTalking]);

    // Typewriter text effect
    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setDisplayedText('');
            setIsTalking(true);
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < message.length) {
                    setDisplayedText(message.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(typeInterval);
                    setIsTalking(false);
                }
            }, 28);
            return () => { clearInterval(typeInterval); setIsTalking(false); };
        } else {
            setShowMessage(false);
            setDisplayedText('');
            setIsTalking(false);
        }
    }, [message]);

    return (
        <div className={`${inline ? 'relative' : 'fixed bottom-4 right-4 z-50'} flex flex-col items-center`}>

            {/* Speech Bubble */}
            <AnimatePresence>
                {showMessage && displayedText && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="bg-gradient-to-br from-white to-amber-50 p-5 rounded-2xl shadow-2xl mb-3 max-w-[300px] relative z-30"
                        style={{ border: '3px solid #F59E0B', borderBottomRightRadius: '6px' }}
                    >
                        <p className="text-gray-800 font-bold text-sm leading-relaxed">{displayedText}</p>
                        {/* Tail */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0"
                            style={{ borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '14px solid #F59E0B' }}
                        />
                        <div className="absolute -bottom-[10px] left-1/2 -translate-x-[7px] w-0 h-0"
                            style={{ borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '11px solid white' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Character */}
            <div className="relative" style={{ width: size, height: size }}>
                {/* Ground shadow */}
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[50%]"
                    style={{ width: size * 0.45, height: size * 0.06, background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)' }}
                />

                {/* Character image — entrance animation once, then static */}
                <motion.img
                    src={currentFrame}
                    alt="Amun - Your Museum Guide"
                    className="absolute inset-0 w-full h-full object-contain z-10 cursor-pointer select-none"
                    style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.12))' }}
                    draggable={false}
                    initial={{ opacity: 0, y: 40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                />

                {/* Sparkles for excited/celebrate — play once */}
                {(onCelebrate || activeMood === 'excited') && !animDone && (
                    <>
                        <motion.span className="absolute -top-4 left-2 text-2xl z-20 pointer-events-none"
                            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.4, 0.3], rotate: [0, 200, 400], y: [0, -20, 0] }}
                            transition={{ duration: 1.2 }}>✨</motion.span>
                        <motion.span className="absolute top-4 -right-2 text-xl z-20 pointer-events-none"
                            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.3, 0.3], y: [0, -15, 0] }}
                            transition={{ duration: 1.0, delay: 0.3 }}>⭐</motion.span>
                        <motion.span className="absolute top-1/3 -left-4 text-xl z-20 pointer-events-none"
                            animate={{ opacity: [0, 1, 0], x: [0, -12, 0] }}
                            transition={{ duration: 1.3, delay: 0.6 }}>💫</motion.span>
                        <motion.span className="absolute -top-2 right-1/4 text-xl z-20 pointer-events-none"
                            animate={{ opacity: [0, 1, 0], y: [0, -25, 0] }}
                            transition={{ duration: 1.1, delay: 0.15 }}>🌟</motion.span>
                    </>
                )}

                {/* Thinking dots — show only during sequence, not after */}
                {activeMood === 'thinking' && !animDone && !showMessage && (
                    <div className="absolute -top-6 right-2 flex gap-1.5 z-20">
                        <motion.div className="w-2.5 h-2.5 rounded-full bg-amber-400"
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
                            transition={{ duration: 1.2, delay: 0 }} />
                        <motion.div className="w-3.5 h-3.5 rounded-full bg-amber-400"
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
                            transition={{ duration: 1.2, delay: 0.3 }} />
                        <motion.div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold text-white"
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
                            transition={{ duration: 1.2, delay: 0.6 }}>?</motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Character;
