import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { hallsData } from '../data/halls';

interface MuseumState {
    badges: string[];
    viewedArtifacts: string[];
    isParentMode: boolean;
    earnBadge: (id: string) => void;
    markViewed: (id: string) => void;
    toggleParentMode: () => void;
    score: number;
    addScore: (points: number) => void;
    /** Array of unlocked hall IDs */
    unlockedHalls: string[];
    /** Check if a specific hall is unlocked */
    isHallUnlocked: (hallId: string) => boolean;
    /** Check if all artifacts in a hall have been viewed */
    isHallComplete: (hallId: string) => boolean;
    /** Manually unlock a hall */
    unlockHall: (hallId: string) => void;
}

const MuseumContext = createContext<MuseumState | null>(null);

export const useMuseum = () => {
    const ctx = useContext(MuseumContext);
    if (!ctx) throw new Error('useMuseum must be used within MuseumProvider');
    return ctx;
};

export const MuseumProvider = ({ children }: { children: ReactNode }) => {
    const [badges, setBadges] = useState<string[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('gem-badges') || '[]');
        } catch { return []; }
    });

    const [viewedArtifacts, setViewedArtifacts] = useState<string[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('gem-viewed') || '[]');
        } catch { return []; }
    });

    const [score, setScore] = useState<number>(() => {
        try {
            return Number(localStorage.getItem('gem-score') || '0');
        } catch { return 0; }
    });

    const [unlockedHalls, setUnlockedHalls] = useState<string[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('gem-unlocked-halls') || '[]');
            // Always ensure the first hall (hanging-obelisk) is unlocked
            if (!saved.includes('hanging-obelisk')) {
                saved.push('hanging-obelisk');
            }
            return saved;
        } catch { return ['hanging-obelisk']; }
    });

    const [isParentMode, setIsParentMode] = useState(false);

    useEffect(() => {
        localStorage.setItem('gem-badges', JSON.stringify(badges));
    }, [badges]);

    useEffect(() => {
        localStorage.setItem('gem-viewed', JSON.stringify(viewedArtifacts));
    }, [viewedArtifacts]);

    useEffect(() => {
        localStorage.setItem('gem-score', String(score));
    }, [score]);

    useEffect(() => {
        localStorage.setItem('gem-unlocked-halls', JSON.stringify(unlockedHalls));
    }, [unlockedHalls]);

    const earnBadge = (id: string) => {
        setBadges(prev => prev.includes(id) ? prev : [...prev, id]);
    };

    const markViewed = (id: string) => {
        setViewedArtifacts(prev => prev.includes(id) ? prev : [...prev, id]);
    };

    const toggleParentMode = () => setIsParentMode(prev => !prev);

    const addScore = (points: number) => setScore(prev => prev + points);

    const unlockHall = useCallback((hallId: string) => {
        setUnlockedHalls(prev => prev.includes(hallId) ? prev : [...prev, hallId]);
    }, []);

    const isHallUnlocked = useCallback((hallId: string): boolean => {
        return unlockedHalls.includes(hallId);
    }, [unlockedHalls]);

    const isHallComplete = useCallback((hallId: string): boolean => {
        const hall = hallsData.find(h => h.id === hallId);
        if (!hall) return false;
        return hall.artifactIds.every(id => viewedArtifacts.includes(id));
    }, [viewedArtifacts]);

    // Auto-unlock: when all artifacts in a hall are viewed, unlock the next hall
    useEffect(() => {
        const sortedHalls = [...hallsData].sort((a, b) => a.unlockOrder - b.unlockOrder);

        for (const hall of sortedHalls) {
            // Check if this hall is unlocked and complete
            if (!unlockedHalls.includes(hall.id)) continue;

            const allViewed = hall.artifactIds.every(id => viewedArtifacts.includes(id));
            if (!allViewed) continue;

            // Find the next hall in the unlock chain
            const nextHall = sortedHalls.find(h => h.unlockOrder === hall.unlockOrder + 1);
            if (nextHall && !unlockedHalls.includes(nextHall.id)) {
                unlockHall(nextHall.id);
            }
        }
    }, [viewedArtifacts, unlockedHalls, unlockHall]);

    return (
        <MuseumContext.Provider value={{
            badges, viewedArtifacts, isParentMode,
            earnBadge, markViewed, toggleParentMode,
            score, addScore,
            unlockedHalls, isHallUnlocked, isHallComplete, unlockHall,
        }}>
            {children}
        </MuseumContext.Provider>
    );
};
