import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

const MASCOT_IMG = '/character/static-mascot.jpg';

// Predefined helpful responses for the virtual assistant
const RESPONSES: Record<string, string[]> = {
    greeting: [
        "Greetings, explorer! I am your museum guide. How can I help you today?",
        "Welcome! I can help you navigate the museum or learn about ancient Egypt.",
        "Hello there! Ready to discover the secrets of the pharaohs?"
    ],
    halls: [
        "The museum has several halls. 'The Grand Gallery' is a great place to start!",
        "You can explore 'Royal Mummies' or 'Artifacts of Daily Life' in the halls section.",
        "Visit the halls to see incredible statues and treasures."
    ],
    map: [
        "The interactive map shows key locations in ancient Egypt like Giza and Luxor.",
        "Use the map to see where magnificent temples and pyramids were built.",
        "Click on Map in the top navigation to explore the geography of Egypt."
    ],
    badges: [
        "You can earn badges by completing quizzes in the different halls!",
        "Check your 'Badges' page to see your progress and what you've unlocked.",
        "Answer questions correctly to collect golden badges!"
    ],
    default: [
        "That's interesting! The history of Egypt is full of wonders.",
        "I am still learning about that, but the museum has many artifacts to explore.",
        "Fascinating! Let's continue exploring the museum."
    ]
};

export const InteractiveMascot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTalking, setIsTalking] = useState(false);
    const [mood, setMood] = useState<'idle' | 'talking' | 'waving' | 'excited' | 'thinking'>('waving');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        synthRef.current = window.speechSynthesis;

        // Initial greeting
        setTimeout(() => {
            setMood('idle');
            // If they haven't opened it yet, maybe just wave after a bit
        }, 3000);

        return () => {
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, []);

    // Auto scroll chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const speak = (text: string) => {
        if (!synthRef.current) return;

        synthRef.current.cancel(); // Stop talking current phrase

        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find a good English voice
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Female') || v.name.includes('Google'))) || voices[0];

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.1; // Slightly higher pitch for a friendly robot feel

        utterance.onstart = () => {
            setIsTalking(true);
            setMood('talking');
        };

        utterance.onend = () => {
            setIsTalking(false);
            setMood('idle');
        };

        utterance.onerror = () => {
            setIsTalking(false);
            setMood('idle');
        }

        synthRef.current.speak(utterance);
    };

    const handleOpenClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) { // Opening
            setMood('excited');
            if (messages.length === 0) {
                const greeting = RESPONSES.greeting[Math.floor(Math.random() * RESPONSES.greeting.length)];
                setMessages([{ text: greeting, isUser: false }]);
                speak(greeting);
            } else {
                setTimeout(() => setMood('idle'), 1000);
            }
        } else { // Closing
            setMood('idle');
            if (synthRef.current) {
                synthRef.current.cancel();
                setIsTalking(false);
            }
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        // User message
        setMessages(prev => [...prev, { text: trimmed, isUser: true }]);
        setInputValue("");
        setMood('thinking');

        // Fake AI response delay
        setTimeout(() => {
            const lowerInput = trimmed.toLowerCase();
            let category = 'default';

            if (lowerInput.includes('hall') || lowerInput.includes('museum') || lowerInput.includes('gallery')) {
                category = 'halls';
            } else if (lowerInput.includes('map') || lowerInput.includes('where') || lowerInput.includes('location')) {
                category = 'map';
            } else if (lowerInput.includes('badge') || lowerInput.includes('quiz') || lowerInput.includes('score')) {
                category = 'badges';
            } else if (lowerInput.includes('hello') || lowerInput.includes('hi ')) {
                category = 'greeting';
            }

            const responseOptions = RESPONSES[category];
            const botReply = responseOptions[Math.floor(Math.random() * responseOptions.length)];

            setMessages(prev => [...prev, { text: botReply, isUser: false }]);
            speak(botReply);

        }, 800);
    };

    const handleQuickAction = (action: 'halls' | 'map' | 'badges') => {
        setInputValue(`Tell me about the ${action}`);
        // We need to submit the form programmatically or just mock the submission
        setTimeout(() => {
            const form = document.getElementById('mascot-chat-form') as HTMLFormElement;
            if (form) {
                // Creating and dispatching a submit event doesn't trigger React's onSubmit
                // Need to call handleSendMessage directly with a fake event or duplicate logic
            }
        }, 100);

        // Simpler: Just duplicate logic for quick click
        setMessages(prev => [...prev, { text: `Tell me about the ${action}?`, isUser: true }]);
        setMood('thinking');

        setTimeout(() => {
            const responseOptions = RESPONSES[action];
            const botReply = responseOptions[Math.floor(Math.random() * responseOptions.length)];

            setMessages(prev => [...prev, { text: botReply, isUser: false }]);
            speak(botReply);
        }, 600);
    }


    const mascotVariants: Variants = {
        idle: {
            y: [0, -6, 0],
            transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        },
        talking: {
            y: [0, -3, 0, -2, 0],
            scale: [1, 1.02, 1, 1.01, 1],
            rotate: [0, 2, -1, 1, 0],
            transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
        },
        waving: {
            y: [0, -8, 0],
            rotate: [0, 8, -4, 5, 0],
            scale: [1, 1.05, 1],
            transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        },
        excited: {
            y: [0, -20, 0, -10, 0],
            scale: [1, 1.08, 0.95, 1.05, 1],
            rotate: [0, -5, 5, -2, 0],
            transition: { duration: 0.6, ease: 'easeOut' }
        },
        thinking: {
            y: [0, -5, 0],
            rotate: [0, -3, 0],
            transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", bounce: 0.3 }}
                        className="bg-[#020C1B]/95 backdrop-blur-md border-[2px] border-[#FFD700] rounded-2xl shadow-[0_8px_32px_rgba(255,215,0,0.15)] w-80 mb-4 overflow-hidden flex flex-col pointer-events-auto"
                        style={{ height: "400px" }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#0A192F] to-[#1A5276] border-b border-[#FFD700]/30 p-3 flex justify-between items-center text-[#FFD700]">
                            <div className="flex items-center gap-2">
                                <span className="font-bold">Museum Guide</span>
                                {(isTalking || mood === 'thinking') && (
                                    <span className="flex gap-1 h-1.5 items-end">
                                        <motion.span animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-[#FFD700] rounded-full"></motion.span>
                                        <motion.span animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-[#FFD700] rounded-full"></motion.span>
                                        <motion.span animate={{ height: [4, 6, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-[#FFD700] rounded-full"></motion.span>
                                    </span>
                                )}
                            </div>
                            <button onClick={handleOpenClick} className="text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.isUser
                                            ? 'bg-[#1A5276] text-white rounded-br-sm'
                                            : 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 rounded-bl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions (only show if no recent messages to save space, or always show) */}
                        {messages.length < 5 && (
                            <div className="px-3 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
                                <button onClick={() => handleQuickAction('halls')} className="text-xs shrink-0 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] px-3 py-1.5 rounded-full transition-colors">🏛️ Tell me about Halls</button>
                                <button onClick={() => handleQuickAction('badges')} className="text-xs shrink-0 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] px-3 py-1.5 rounded-full transition-colors">🏅 How to get Badges?</button>
                                <button onClick={() => handleQuickAction('map')} className="text-xs shrink-0 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] px-3 py-1.5 rounded-full transition-colors">🗺️ Where is the Map?</button>
                            </div>
                        )}

                        {/* Input Area */}
                        <form id="mascot-chat-form" onSubmit={handleSendMessage} className="p-3 border-t border-[#FFD700]/30 bg-[#020C1B]">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask me something..."
                                    className="w-full bg-[#0A192F] text-white text-sm rounded-full pl-4 pr-10 py-2.5 border border-[#FFD700]/30 focus:outline-none focus:border-[#FFD700] transition-colors"
                                />
                                <button type="submit" className="absolute right-2 text-[#FFD700] hover:scale-110 transition-transform p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -rotate-90" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Mascot */}
            <div className="relative pointer-events-auto">
                <motion.button
                    onClick={handleOpenClick}
                    className="relative w-24 h-24 rounded-full bg-[#020C1B]/80 backdrop-blur-sm border-[3px] border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] flex items-center justify-center transition-shadow group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.img
                        src={MASCOT_IMG}
                        alt="Museum Guide Mascot"
                        className="w-[85%] h-[85%] object-contain rounded-full drop-shadow-md"
                        variants={mascotVariants}
                        initial="idle"
                        animate={mood}
                        draggable={false}
                    />

                    {/* Notification Dot */}
                    {!isOpen && messages.length === 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3498DB] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#3498DB] border border-[#020C1B]"></span>
                        </span>
                    )}

                    {/* Tooltip on hover */}
                    {!isOpen && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-full mr-4 bg-[#0A192F] text-[#FFD700] text-xs font-bold py-1.5 px-3 rounded-full border border-[#FFD700]/30 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                            Need help?
                        </div>
                    )}
                </motion.button>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 215, 0, 0.3);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 215, 0, 0.5);
                }
            `}</style>
        </div>
    );
};
