module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
    },
    extend: {
      colors: {
        'pm-green': '#13c57b',
        'pm-grey': '#f1f3f5',
        'pm-dark-grey': '#737475',
        'pm-black': '#1f1f1f',
      },
    },
  },
  plugins: [],
};
