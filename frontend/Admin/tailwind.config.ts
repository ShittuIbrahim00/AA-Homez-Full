import type { Config } from 'tailwindcss'

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
        kanit: ['Kanit'],
        poppins: ['Poppins'],
      },
      colors: {
        main: {
          primary: '#E14B0E',
          secondary: '#FE783D',
          grey: '#F2EEED',
          white: '#fff',
          grey2: '#bbb',
          milk: '#fcfcfc',
          bgGrey: '#e1e1e1',
          primaryBlue: '#1293BA',
          primaryLess1: '#B2CBE6',
          primaryLess2: '#E8F8FD',
          secondary1: '#ffee88',
          lightGrey: '#F3F5F6',
          grey1: '#383E42',
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
      screens: {
        xs: '320px',
        sm: '480px',
        ss: '620px',
        md: '768px',
        lg: '1060px',
        xl: '1200px',
        '2xl': '1700px',
      },
      keyframes: {
        slideUpFade: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(300px) rotate(360deg)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { height: '0', opacity: '0' },
          '100%': { height: 'auto', opacity: '1' },
        },
      },
      animation: {
        slideUpFade: 'slideUpFade 0.5s ease-out forwards',
        confettiFall: 'confettiFall 1.2s ease-in forwards',
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        slideDown: 'slideDown 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config
