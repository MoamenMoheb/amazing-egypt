/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Fredoka', 'sans-serif'],
            },
            colors: {
                brand: {
                    primary: '#FFD700', // Gold/Yellow (Sun, Sand)
                    secondary: '#00A8E8', // Cyan/Blue (Nile, Sky)
                    accent: '#FF6B6B', // Coral/Red (Energy)
                    dark: '#2D3436', // Text
                    light: '#F9F9F9', // Background
                }
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
