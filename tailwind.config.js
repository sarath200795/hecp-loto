/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Light cream + yellow claymorphism. `steel` is an INVERTED warm scale
        // (50 = darkest warm ink … 950 = lightest cream) so the app's pervasive
        // "light text on dark surface" classes render as dark-on-light.
        steel: {
          50: '#1d1b17', // darkest warm ink (text)
          100: '#2a2823',
          200: '#403d36',
          300: '#5c584f',
          400: '#8a857a', // muted text
          500: '#a39d91',
          600: '#c2bcb0',
          700: '#ddd7ca', // light warm border
          800: '#ebe6db', // light surface / chips
          900: '#f3efe7', // lighter surface
          950: '#faf7f1', // lightest
        },
        clay: '#efe8e4', // warm off-white — app bg tone / input wells
        claySurface: '#fffdf9', // near-white card surface
        ink: '#1d1b17', // fixed near-black for text on yellow (scale-independent)
        hazard: {
          DEFAULT: '#ffcc1a', // safety yellow accent
          dark: '#e0ad00',
        },
        danger: '#e5484d',
        safe: '#2e9e5b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.9rem',
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2.25rem',
      },
      boxShadow: {
        // Soft warm clay shadows on light surfaces.
        sm: '0 4px 10px -4px rgba(120,110,90,0.22), inset 0 1px 2px rgba(255,255,255,0.9)',
        DEFAULT:
          '0 8px 18px -8px rgba(120,110,90,0.26), inset 0 2px 4px rgba(255,255,255,0.95), inset 0 -4px 8px rgba(150,140,120,0.10)',
        md: '0 10px 22px -8px rgba(120,110,90,0.28), inset 0 2px 4px rgba(255,255,255,0.95), inset 0 -5px 10px rgba(150,140,120,0.10)',
        lg: '0 14px 30px -10px rgba(120,110,90,0.30), inset 0 3px 5px rgba(255,255,255,0.95), inset 0 -6px 12px rgba(150,140,120,0.12)',
        xl: '0 18px 36px -12px rgba(120,110,90,0.32), inset 0 3px 6px rgba(255,255,255,0.95), inset 0 -7px 14px rgba(150,140,120,0.12)',
        '2xl':
          '0 24px 48px -14px rgba(120,110,90,0.34), inset 0 4px 8px rgba(255,255,255,0.97), inset 0 -8px 16px rgba(150,140,120,0.13)',
        clay: '0 16px 32px -10px rgba(120,110,90,0.30), inset 0 3px 6px rgba(255,255,255,0.95), inset 0 -8px 14px rgba(150,140,120,0.14)',
        'clay-inset':
          'inset 0 4px 10px rgba(150,140,120,0.28), inset 0 -2px 5px rgba(255,255,255,0.85)',
        none: 'none',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
