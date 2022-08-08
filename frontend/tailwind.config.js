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
        'pm-green': 'var(--pm-green)',
        'pm-grey': 'var(--pm-grey)',
        'pm-dark-grey': 'var(--pm-dark-grey)',
        'pm-light-grey': 'var(--pm-light-grey)',
        'pm-black': 'var(--pm-black)',
        'pm-white': 'var(--pm-white)',
        'pm-background': 'var(--pm-background)',
      },
    },
  },
  plugins: [],
};
