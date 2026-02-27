import { motion } from 'framer-motion';

interface DidYouKnowProps {
    text: string;
}

const DidYouKnow = ({ text }: DidYouKnowProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border-2 border-amber-300 shadow-lg relative overflow-hidden"
        >
            {/* Decorative sparkle */}
            <div className="absolute top-2 right-2 text-2xl animate-pulse">✨</div>
            <div className="absolute bottom-2 left-2 text-lg opacity-50 animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>

            <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0 mt-1">
                    <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                        className="inline-block"
                    >
                        🤔
                    </motion.span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-amber-800 mb-1">Did You Know?</h3>
                    <p className="text-amber-900 font-medium leading-relaxed">{text}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default DidYouKnow;
