/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.green.600'),
              '&:hover': {
                color: theme('colors.green.700'),
              },
            },
            h2: {
              color: theme('colors.gray.800'),
              fontWeight: '700',
            },
            h3: {
              color: theme('colors.gray.800'),
              fontWeight: '600',
            },
            blockquote: {
              borderLeftColor: theme('colors.green.500'),
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
