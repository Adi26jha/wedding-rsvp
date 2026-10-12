import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FAF4E8",
          50: "#FFFDF9",
          100: "#FAF4E8",
          200: "#F4ECD9",
          300: "#EADCC2",
          400: "#DFCAAA",
        },
        maroon: {
          DEFAULT: "#5B0F1E",
          50: "#FAF0F2",
          100: "#F2D8DE",
          200: "#E4B1BD",
          700: "#7A182B",
          800: "#5B0F1E",
          900: "#3E0813",
        },
        emerald: {
          DEFAULT: "#0F3D2E",
          50: "#F0F7F4",
          100: "#DBECE4",
          700: "#1A5844",
          800: "#0F3D2E",
          900: "#09241B",
        },
        gold: {
          DEFAULT: "#C9A24B",
          100: "#FAF3E3",
          200: "#F4E5C2",
          300: "#ECC876",
          400: "#DAB55E",
          500: "#C9A24B",
          600: "#B08A37",
          700: "#9B7524",
          800: "#785816",
        },
        charcoal: {
          DEFAULT: "#23211E",
          500: "#6B655C",
          700: "#433F39",
          800: "#2B2824",
          900: "#1C1A17",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-shimmer": "linear-gradient(135deg, #ECC876 0%, #C9A24B 50%, #9B7524 100%)",
        "gold-foil": "linear-gradient(135deg, #FFE8A3 0%, #C9A24B 40%, #ECC876 70%, #9B7524 100%)",
        "maroon-gradient": "linear-gradient(180deg, #5B0F1E 0%, #3E0813 100%)",
      },
      boxShadow: {
        luxe: "0 10px 30px -5px rgba(91, 15, 30, 0.08), 0 0 0 1px rgba(201, 162, 75, 0.2)",
        "luxe-hover": "0 20px 45px -10px rgba(91, 15, 30, 0.2), 0 0 0 1px rgba(201, 162, 75, 0.45)",
        gold: "0 4px 20px rgba(201, 162, 75, 0.3)",
        "gold-glow": "0 0 30px rgba(201, 162, 75, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
