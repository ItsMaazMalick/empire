import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff", // White background
        foreground: "#022763", // Blue foreground
        card: {
          DEFAULT: "#f0f8ff", // Lighter card color to match the white theme
          foreground: "#022763", // Blue foreground for the card
        },
        popover: {
          DEFAULT: "hsl(210, 100%, 97%)", // Soft light blue for popover
          foreground: "hsl(210, 80%, 20%)", // Dark blue for popover text
        },
        primary: {
          DEFAULT: "#66a5ff", // Light blue primary color
          foreground: "#022763", // Dark blue foreground for primary elements
        },
        secondary: {
          DEFAULT: "#1e3a5f", // Slightly darker blue for secondary elements
          foreground: "#ffffff", // White text on secondary elements
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
