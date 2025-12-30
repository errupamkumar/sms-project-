/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: 'var(--bg-main)',
          card: 'var(--bg-card)',
          border: 'var(--border-color)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
        },
        teal: {
          primary: '#2DD4BF',
          hover: '#14B8A6',
        }
      },
    },
  },
  plugins: [],
}
