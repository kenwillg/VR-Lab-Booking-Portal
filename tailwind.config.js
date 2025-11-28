/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#0F172A',
        'bg-card': '#1E293B',
        'text-primary': '#F8FAFC',
        'text-secondary': '#94A3B8',
        'status-available': '#10B981',
        'status-booked': '#EF4444',
        'status-full': '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'button': '16px',
      },
    },
  },
  plugins: [],
}

