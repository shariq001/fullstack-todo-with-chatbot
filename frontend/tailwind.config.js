/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // T029: Add custom animation delays for loading indicators
      animation: {
        bounce: 'bounce 1s infinite',
      },
      // Custom utility for animation delays
      transitionDelay: {
        100: '100ms',
        200: '200ms',
      },
    },
  },
  plugins: [
    // T029: Plugin to add animation-delay utilities
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              animationDelay: value,
            };
          },
        },
        {
          values: theme('transitionDelay'),
        }
      );
    },
  ],
}