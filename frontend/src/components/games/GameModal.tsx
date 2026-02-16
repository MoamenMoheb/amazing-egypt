import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface GameModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title: string;
}

const GameModal = ({ isOpen, onClose, children, title }: GameModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative bg-[#FDF5E6] rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-4 border-[#CDA434] animate-in zoom-in-95 duration-200">
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 bg-[#CDA434] text-white rounded-full hover:bg-[#B8860B] transition-colors shadow-md"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-[#8B4513] mb-4 text-center">{title}</h2>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default GameModal;
