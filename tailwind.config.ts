import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        racing: {
          red: '#DC0000',
          black: '#0A0A0A',
          gray: {
            900: '#1A1A1A',
            800: '#2A2A2A',
            700: '#3A3A3A',
            600: '#4A4A4A',
            500: '#6A6A6A',
          },
        },
      },
      fontFamily: {
        racing: ['Orbitron', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'speed-lines': 'speedLines 1s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        speedLines: {
          '0%, 100%': { transform: 'translateX(0) scaleX(1)' },
          '50%': { transform: 'translateX(-10px) scaleX(1.1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(220, 0, 0, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(220, 0, 0, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
