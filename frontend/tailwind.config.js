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
        'pm-accent': 'var(--pm-accent)',
        'pm-grey-primary': 'var(--pm-grey-primary)',
        'pm-grey-secondary': 'var(--pm-grey-secondary)',
        'pm-black': 'var(--pm-black)',
        'pm-white': 'var(--pm-white)',
        'pm-background': 'var(--pm-background)',
      },
    },
  },
  plugins: [],
};
