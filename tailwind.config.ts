// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Navy Blues
        navy: {
          50: '#e6e7ef',
          100: '#b3b7d6',
          200: '#8089bd',
          300: '#4d5ba4',
          400: '#1a2d8b',
          500: '#03045e',  // Main Navy
          600: '#02034e',
          700: '#02023e',
          800: '#01022e',
          900: '#01011e',
        },
        // Professional Blue
        blue: {
          50: '#e6ecf4',
          100: '#b3c4e0',
          200: '#809ccc',
          300: '#4d74b8',
          400: '#1a4ca4',
          500: '#023e8a',  // Professional Blue
          600: '#023474',
          700: '#022a5e',
          800: '#012048',
          900: '#011632',
        },
        // Accent Blue
        accent: {
          50: '#e6f1f8',
          100: '#b3d4ed',
          200: '#80b7e2',
          300: '#4d9ad7',
          400: '#1a7dcc',
          500: '#0077b6',  // Accent Blue
          600: '#00649a',
          700: '#00517e',
          800: '#003e62',
          900: '#002b46',
        },
        // Stainless Steel (Metallic Grays)
        steel: {
          50: '#f7f7f7',
          100: '#e8e8e8',
          200: '#d9d9d9',  // Stainless Steel
          300: '#bdbdbd',
          400: '#a1a1a1',
          500: '#858585',
          600: '#696969',
          700: '#4d4d4d',
          800: '#313131',
          900: '#151515',
        },
        // Warm Beige
        beige: {
          50: '#fefdfb',
          100: '#fcfaf5',
          200: '#f9f5ef',
          300: '#f5efe6',  // Warm Beige
          400: '#ede3d4',
          500: '#e5d7c2',
          600: '#d4c2a6',
          700: '#c3ad8a',
          800: '#b2986e',
          900: '#a18352',
        },
        // Dark Charcoal
        charcoal: {
          50: '#f4f5f5',
          100: '#e1e2e3',
          200: '#c4c6c8',
          300: '#a7aaad',
          400: '#8a8e92',
          500: '#6d7277',
          600: '#50565c',
          700: '#333a41',
          800: '#1f2937',  // Dark Charcoal
          900: '#111827',
        },
        // Premium Red (CTA)
        red: {
          50: '#fef2f2',
          100: '#fce5e5',
          200: '#f8bfbf',
          300: '#f39999',
          400: '#ee7373',
          500: '#e94d4d',
          600: '#c1121f',  // Premium Red
          700: '#a10f1a',
          800: '#810c15',
          900: '#610910',
        },
      },
      backgroundColor: {
        'admin': '#f5efe6',  // Admin dashboard background
      },
      boxShadow: {
        'card': '0 2px 4px rgba(3, 4, 94, 0.05), 0 4px 8px rgba(3, 4, 94, 0.05)',
        'card-hover': '0 8px 16px rgba(3, 4, 94, 0.1), 0 4px 8px rgba(3, 4, 94, 0.08)',
        'nav': '0 2px 8px rgba(3, 4, 94, 0.1)',
        'button': '0 2px 4px rgba(193, 18, 31, 0.2)',
      },
      animation: {
        'shake': 'shake 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;