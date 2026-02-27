import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface MuseumState {
    badges: string[];
    viewedArtifacts: string[];
    isParentMode: boolean;
    earnBadge: (id: string) => void;
    markViewed: (id: string) => void;
    toggleParentMode: () => void;
    score: number;
    addScore: (points: number) => void;
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

    const earnBadge = (id: string) => {
        setBadges(prev => prev.includes(id) ? prev : [...prev, id]);
    };

    const markViewed = (id: string) => {
        setViewedArtifacts(prev => prev.includes(id) ? prev : [...prev, id]);
    };

    const toggleParentMode = () => setIsParentMode(prev => !prev);

    const addScore = (points: number) => setScore(prev => prev + points);

    return (
        <MuseumContext.Provider value={{
            badges, viewedArtifacts, isParentMode,
            earnBadge, markViewed, toggleParentMode,
            score, addScore,
        }}>
            {children}
        </MuseumContext.Provider>
    );
};
