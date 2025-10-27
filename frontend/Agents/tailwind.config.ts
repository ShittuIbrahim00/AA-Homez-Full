import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
    './src/constants/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/global/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
    './src/utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        main: {
          primary: '#E14B0E',        // Primary brand orange
          secondary: '#FE783D',      // Secondary orange
          grey: '#F2EEED',           // Light grey background
          grey2: '#bbb',             // Medium grey (text muted)
          milk: '#fcfcfc',           // Near white

          primaryBlue: '#1293BA',    // Accent blue
          primaryLess1: '#B2CBE6',
          primaryLess2: '#E8F8FD',
          secondary1: '#ffee88',
          lightGrey: '#F3F5F6',
          grey1: '#383E42',          // Dark grey text
          greyShadow: '#F7E9EB',
          secondary2: '#F9F9F9',

          dashbordb: '#DFCF6D',
          dashbordb3: '#D17D86',
          dashbordb3a: '#B22735',
          dashbordb1: '#E8EAEC',
          dashboardcola: '#4AC7ED',

          keynotebg: '#A2E2F6',
          hoverbg: '#D1F1FA',
          counterbg: '#ECF2F9',
          listBg: '#F9FBFE',
          success: '#00CC99',
        },
      },
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'modal': '1000',
        'dropdown': '1010',
        'navbar': '1020',
        'tooltip': '1030',
        'toast': '1040',
        'max': '9999',
      },
      screens: {
        xs: '480px',
        ss: '620px',
        sm: '768px',
        md: '1060px',
        lg: '1200px',
        xl: '1700px',
      },
    },
  },
  plugins: [],
};

export default config;