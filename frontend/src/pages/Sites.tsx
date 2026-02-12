import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sitesData } from '../data/sites';
import { motion } from 'framer-motion';

const Sites = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-brand-light pt-24 pb-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-brand-secondary mb-12 animate-bounce-slow">
                    {t('nav.sites')}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sitesData.map((site, index) => (
                        <motion.div
                            key={site.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={`/sites/${site.id}`} className="block group">
                                <div className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-transparent group-hover:border-brand-primary transition-all transform group-hover:-translate-y-2">
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={site.image}
                                            alt={site.label}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                            <h2 className="text-2xl font-bold text-white">{t(`sites.${site.id}.title`, site.label)}</h2>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-gray-600 line-clamp-2">
                                            {t(`sites.${site.id}.description`, 'Explore this amazing place!')}
                                        </p>
                                        <div className="mt-4 flex justify-end">
                                            <span className="text-brand-accent font-bold group-hover:translate-x-1 transition-transform inline-block">
                                                Read more →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Sites
