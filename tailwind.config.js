module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      lg: '1024px',
    },
    extend: {
      colors: {
        'pm-green': '#13c57b',
        'pm-grey': '#F1F3F5',
        'pm-black': '#1F1F1F',
      },
    },
  },
  plugins: [],
};
