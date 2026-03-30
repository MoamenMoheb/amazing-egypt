import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type MascotReaction =
    | 'idle'
    | 'welcome'
    | 'pointing'
    | 'celebration'
    | 'confused'
    | 'thinking'
    | 'idea'
    | 'speaking';

interface MascotContextType {
    currentReaction: MascotReaction;
    triggerReaction: (reaction: MascotReaction, message?: string, duration?: number) => void;
    message: string;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export const MascotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentReaction, setCurrentReaction] = useState<MascotReaction>('idle');
    const [message, setMessage] = useState<string>('');
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const IDLE_TIMEOUT = 10000; // 10 seconds

    const resetIdleTimer = () => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }

        // Don't set idle timer if we are currently explicitly showing a reaction
        if (currentReaction !== 'idle' && currentReaction !== 'thinking') {
            return;
        }

        // If we're idle, start the 10s timer to transition to 'thinking'
        idleTimerRef.current = setTimeout(() => {
            setCurrentReaction('thinking');
            setMessage(''); // Clear message when thinking
        }, IDLE_TIMEOUT);
    };

    // Setup global event listeners for idle tracking
    useEffect(() => {
        const handleUserActivity = () => {
            // Reset back to idle if we were thinking
            if (currentReaction === 'thinking') {
                setCurrentReaction('idle');
            }
            resetIdleTimer();
        };

        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);
        window.addEventListener('mousedown', handleUserActivity);
        window.addEventListener('touchstart', handleUserActivity);

        // Initial timer
        resetIdleTimer();

        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
            window.removeEventListener('mousedown', handleUserActivity);
            window.removeEventListener('touchstart', handleUserActivity);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [currentReaction]);

    const triggerReaction = (reaction: MascotReaction, msg: string = '', duration: number = 3000) => {
        setCurrentReaction(reaction);
        setMessage(msg);

        // Clear any existing reset timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Clear the idle timer completely while a reaction is showing
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }

        // Don't auto-reset 'idle' or 'thinking'
        if (reaction !== 'idle' && reaction !== 'thinking') {
            timeoutRef.current = setTimeout(() => {
                setCurrentReaction('idle');
                setMessage('');
                resetIdleTimer(); // Restart the idle timer after returning to idle
            }, duration);
        }
    };

    return (
        <MascotContext.Provider value={{ currentReaction, triggerReaction, message }}>
            {children}
        </MascotContext.Provider>
    );
};

export const useMascot = () => {
    const context = useContext(MascotContext);
    if (context === undefined) {
        throw new Error('useMascot must be used within a MascotProvider');
    }
    return context;
};
