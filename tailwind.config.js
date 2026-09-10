/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { note: { muted: '#8E8E93', link: '#355b78' } },
    },
  },
  plugins: [],
};
