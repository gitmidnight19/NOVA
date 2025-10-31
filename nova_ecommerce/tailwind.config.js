//@type {import('tailwindcss').Config} 
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavanda: '#D8CDE8',
        'sky-light': '#D8F2F8',
        'pink-soft': '#F9B6D2',
        'peach-light': '#FFD8BD',
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
      },
    },
  },
  plugins: [],
}
