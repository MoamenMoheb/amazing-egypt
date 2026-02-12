import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Home = () => {
    const [count, setCount] = useState(0)
    const { t } = useTranslation()

    return (
        <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center font-sans text-brand-dark overflow-hidden relative">
            <div className="absolute top-10 left-10 w-32 h-32 bg-brand-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-brand-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-8 left-20 w-32 h-32 bg-brand-accent rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>

            <div className="z-10 text-center px-4">
                <h1 className="text-6xl md:text-8xl font-bold mb-4 text-brand-secondary drop-shadow-md animate-bounce-slow">
                    {t('title', 'Amazing Egypt')}
                </h1>
                <p className="text-2xl md:text-3xl mb-8 font-medium text-brand-dark">
                    {t('explore', 'Explore the Land of Pharaohs!')}
                </p>

                <div className="card bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-lg border-2 border-white max-w-md mx-auto">
                    <button
                        onClick={() => setCount((count) => count + 1)}
                        className="px-8 py-4 bg-brand-accent text-white text-xl font-bold rounded-full hover:bg-red-500 transition-all transform hover:scale-105 shadow-md w-full"
                    >
                        {t('startAdventure', 'Start Adventure')}: {count}
                    </button>

                    <p className="mt-4 text-gray-600">
                        {t('ready', 'Get ready for a fun journey!')}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Home
