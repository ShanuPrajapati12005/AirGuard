/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        card: "var(--card)",
        ink: "var(--ink)",
        muted: "var(--mut)",
        line: "var(--line)",
        accent: "var(--ac)",
        "on-accent": "var(--onac)",
        "accent-2": "var(--ac2)",
        ok: "var(--ok)",
        border: "var(--line)",
        input: "var(--line)",
        ring: "var(--ac)",
        foreground: "var(--ink)",
        primary: {
          DEFAULT: "var(--ac)",
          foreground: "var(--onac)",
        },
        secondary: {
          DEFAULT: "var(--card)",
          foreground: "var(--ink)",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "var(--card)",
          foreground: "var(--ink)",
        },
        aqi: {
          good: "#13a56b", // 0-50
          satisfactory: "#84cc16", // 51-100
          moderate: "#a8741f", // 101-200
          poor: "#f97316", // 201-300
          verypoor: "#ef4444", // 301-400
          severe: "#8b5cf6", // 401-500
        },
        navy: {
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Instrument Sans", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "9px",
        lg: "12px",
        md: "9px",
        sm: "6px",
      },
      boxShadow: {
        card: "var(--sh)",
      },
      maxWidth: {
        page: "1160px",
        landing: "1120px",
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
