import type { Config } from "tailwindcss";

const tailwindConfig: Config = {
  // Enable dark mode using a CSS class
  darkMode: ["class"],

  // Paths to all template files
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  prefix: "",

  theme: {
    // Center container by default with padding and max width for 2xl screens
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },

      // Use CSS variables for easy theming and customization
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          glow: "hsl(var(--secondary-glow))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          glow: "hsl(var(--accent-glow))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          glow: "hsl(var(--card-glow))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
      },

      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)",
        "gradient-pink": "var(--gradient-pink)",
        "gradient-cyber": "var(--gradient-cyber)",
        "gradient-fusion": "var(--gradient-fusion)",
        "gradient-card": "var(--gradient-card)",
      },

      boxShadow: {
        // Soft neumorphic shadows and inset shadows consistent with CSS variables
        card: "0 0 15px hsl(220 13% 5% / 0.3), inset 0 1px 0 hsl(220 13% 20%), inset 0 -1px 0 hsl(220 13% 8%)",
        glow: "0 0 12px hsl(320 85% 65% / 0.2)",
        cyber: "0 0 18px hsl(245 58% 62% / 0.15)",
        pink: "0 0 15px hsl(320 85% 65% / 0.25)",
        neon: "0 0 22px hsl(320 85% 65% / 0.3), 0 0 40px hsl(320 85% 65% / 0.2)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },

      animation: {
        "slide-in-up": "slide-in-up 0.6s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "fade-in-scale": "fade-in-scale 0.4s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite alternate",

        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Keep your existing keyframes, possibly declared in CSS
        "slide-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px) scale(0.9)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(180deg)" },
        },
        "pulse-glow": {
          "0%": { "box-shadow": "0 0 15px hsl(320 85% 65% / 0.25)" },
          "100%": { "box-shadow": "0 0 22px hsl(320 85% 65% / 0.3), 0 0 40px hsl(320 85% 65% / 0.2)" },
        },
      },
    },
  },

  // Include animation plugin for extended animation utilities
  plugins: [require("tailwindcss-animate")],
};

export default tailwindConfig;
