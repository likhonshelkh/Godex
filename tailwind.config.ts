import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "var(--font-sans)", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        "surface-primary": "hsl(var(--color-surface-primary) / <alpha-value>)",
        "surface-muted": "hsl(var(--color-surface-muted) / <alpha-value>)",
        "surface-elevated": "hsl(var(--color-surface-elevated) / <alpha-value>)",
        "surface-inverted": "hsl(var(--color-surface-inverted) / <alpha-value>)",
        "content-strong": "hsl(var(--color-content-strong) / <alpha-value>)",
        "content-subtle": "hsl(var(--color-content-subtle) / <alpha-value>)",
        "accent-primary": "hsl(var(--color-accent-primary) / <alpha-value>)",
        "accent-secondary": "hsl(var(--color-accent-secondary) / <alpha-value>)",
        "accent-tertiary": "hsl(var(--color-accent-tertiary) / <alpha-value>)",
        "border-soft": "hsl(var(--color-border-soft) / <alpha-value>)",
        "border-strong": "hsl(var(--color-border-strong) / <alpha-value>)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle at var(--gradient-x, 50%) var(--gradient-y, 50%), hsl(var(--gradient-start)), hsl(var(--gradient-end)))",
        "gradient-hero": "linear-gradient(135deg, hsl(var(--gradient-start)) 0%, hsl(var(--gradient-mid)) 50%, hsl(var(--gradient-end)) 100%)",
      },
      boxShadow: {
        glow: "0 20px 80px -30px hsla(var(--color-accent-primary), 0.65)",
        "glow-strong": "0 28px 110px -45px hsla(var(--color-accent-primary), 0.85)",
        subtle: "0 10px 40px -24px hsla(var(--color-content-strong), 0.2)",
      },
      borderRadius: {
        xl: "1.5rem",
      },
      spacing: {
        18: "4.5rem",
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
