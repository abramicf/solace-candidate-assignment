import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mollie': ['Mollie Glaston', 'cursive'],
      },
      colors: {
        // Primary color - Deep Green (#285E50)
        primary: {
          50: '#f0f7f5',
          100: '#dcebe7',
          200: '#bbd7d0',
          300: '#92bdb3',
          400: '#699e91',
          500: '#285E50', // Your provided color
          600: '#234f44',
          700: '#1d4138',
          800: '#17332c',
          900: '#112520',
          950: '#0a1714',
        },
        // Secondary color - Warm Gold (#D7A13B)
        secondary: {
          50: '#fdf8ed',
          100: '#f9edcf',
          200: '#f2dba1',
          300: '#e5c06c',
          400: '#D7A13B', // Your provided color
          500: '#c68d2a',
          600: '#a57522',
          700: '#845d1b',
          800: '#624515',
          900: '#402c0d',
          950: '#1f1506',
        },
        // Neutral colors for text and backgrounds
        neutral: {
          50: '#f8f9f8',
          100: '#f0f1f0',
          200: '#e4e6e4',
          300: '#d1d4d1',
          400: '#a8aea8',
          500: '#808780',
          600: '#636963',
          700: '#4c514c',
          800: '#343834',
          900: '#232523',
          950: '#121312',
        },
        // Semantic colors
        success: {
          500: '#285E50', // Using your primary green for success states
          100: '#dcebe7',
          700: '#1d4138',
        },
        warning: {
          500: '#D7A13B', // Using your secondary gold for warning states
          100: '#f9edcf',
          700: '#845d1b',
        },
        error: {
          500: '#dc2626',
          100: '#fee2e2',
          700: '#b91c1c',
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
