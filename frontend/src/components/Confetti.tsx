import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiProps {
    show: boolean;
    duration?: number;
}

const COLORS = ['#FFD700', '#FF6B6B', '#00A8E8', '#4CAF50', '#E91E63', '#FF9800', '#9C27B0'];

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotation: number;
    delay: number;
}

const Confetti = ({ show, duration = 3000 }: ConfettiProps) => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (show) {
            const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: -10,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                size: Math.random() * 10 + 5,
                rotation: Math.random() * 360,
                delay: Math.random() * 0.5,
            }));
            setParticles(newParticles);

            const timer = setTimeout(() => setParticles([]), duration);
            return () => clearTimeout(timer);
        } else {
            setParticles([]);
        }
    }, [show, duration]);

    if (particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute"
                    style={{
                        left: `${p.x}%`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    }}
                    initial={{ y: -20, rotate: 0, opacity: 1 }}
                    animate={{
                        y: window.innerHeight + 100,
                        rotate: p.rotation + 720,
                        opacity: [1, 1, 0],
                        x: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 100],
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        delay: p.delay,
                        ease: 'easeIn',
                    }}
                />
            ))}
        </div>
    );
};

export default Confetti;
