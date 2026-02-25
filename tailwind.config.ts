import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material 3 Dark Theme Palette
        m3: {
          // Background: The deepest layer
          background: '#0a0a0a', 
          // Surface: Cards, Modals, Top Bars
          surface: '#1c1c1c', 
          // Surface Variant: Borders, Dividers, or secondary inputs
          surfaceVariant: '#2b2b2b',
          // Primary: Your specific Yellow accent
          primary: '#FFD700', // Classic Gold/Yellow
          // Container: Lighter yellow for subtle backgrounds
          primaryContainer: '#4d4100',
          // Text Colors
          onBackground: '#e6e1e5',
          onSurface: '#e6e1e5',
          onPrimary: '#352d00', // Dark text for high contrast on yellow buttons
          textMuted: '#938f99',
        }
      },
      borderRadius: {
        // M3 uses very specific large rounding
        'm3-card': '28px',
        'm3-btn': '100px',
      }
    },
  },
  plugins: [],
};
export default config;