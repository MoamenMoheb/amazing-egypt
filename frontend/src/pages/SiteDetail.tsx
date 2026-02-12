import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Volume2 } from 'lucide-react';

const sitesData: Record<string, { id: string; image: string; color: string }> = {
    cairo: { id: 'cairo', image: 'https://images.unsplash.com/photo-1572252009289-9d53c6d99a89?auto=format&fit=crop&w=800', color: '#FFD700' },
    alex: { id: 'alex', image: 'https://images.unsplash.com/photo-1590240924765-4f400787e91d?auto=format&fit=crop&w=800', color: '#00A8E8' },
    luxor: { id: 'luxor', image: 'https://images.unsplash.com/photo-1566192257211-13768be4d8C0?auto=format&fit=crop&w=800', color: '#FF6B6B' },
    aswan: { id: 'aswan', image: 'https://images.unsplash.com/photo-1533513063857-798418a09f87?auto=format&fit=crop&w=800', color: '#E67E22' },
    hurghada: { id: 'hurghada', image: 'https://images.unsplash.com/photo-1563212891-b0e78c859c25?auto=format&fit=crop&w=800', color: '#1ABC9C' },
};

const SiteDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const site = id ? sitesData[id] : null;

    if (!site) {
        return <div className="p-20 text-center">Site not found!</div>;
    }

    const handleSpeak = () => {
        const text = t(`sites.${site.id}.description`, 'Description coming soon...');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Should be dynamic based on i18n language
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="min-h-screen bg-brand-light pt-24 pb-10 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/sites" className="flex items-center gap-2 text-brand-secondary font-bold mb-6 hover:underline">
                    <ArrowLeft /> {t('back', 'Back to Sites')}
                </Link>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
                    <div className="relative h-64 md:h-96">
                        <img src={site.image} alt={site.id} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                            <h1 className="text-4xl md:text-6xl font-bold text-white capitalize drop-shadow-lg">
                                {t(`sites.${site.id}.title`, site.id)}
                            </h1>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-2">
                                <span className="bg-brand-primary/20 text-brand-dark px-3 py-1 rounded-full text-sm font-bold">
                                    Historical
                                </span>
                                <span className="bg-brand-secondary/20 text-brand-dark px-3 py-1 rounded-full text-sm font-bold">
                                    Popular
                                </span>
                            </div>
                            <button
                                onClick={handleSpeak}
                                className="bg-brand-accent text-white p-3 rounded-full hover:bg-red-500 shadow-md transition-transform hover:scale-110"
                                title="Listen"
                            >
                                <Volume2 size={24} />
                            </button>
                        </div>

                        <p className="text-xl md:text-2xl leading-relaxed text-gray-700 font-medium">
                            {t(`sites.${site.id}.description`, 'A fascinating destination with rich history and culture. Perfect for young explorers!')}
                        </p>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-brand-light p-6 rounded-2xl border-2 border-brand-primary">
                                <h3 className="text-xl font-bold text-brand-dark mb-2">Fun Fact 💡</h3>
                                <p className="text-gray-600">Did you know? {t(`sites.${site.id}.fact`, 'This place has secrets waiting to be discovered!')}</p>
                            </div>
                            <div className="bg-brand-light p-6 rounded-2xl border-2 border-brand-secondary">
                                <h3 className="text-xl font-bold text-brand-dark mb-2">Activity 🎮</h3>
                                <p className="text-gray-600">Try to find the hidden symbol in the main temple!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteDetail;
