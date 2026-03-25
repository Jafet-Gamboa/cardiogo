/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2D9CDB",
          dark: "#003B75",
          light: "#d2e9fcf1",
        },
        success: {
          DEFAULT: "#27AE60",
          dark: "#00753B",
          light: "#d8ffecff",
        },
        danger: {
          DEFAULT: "#FF0000",
          dark: "#750000",
          light: "#ffe6ecff",
        },
        gray: {
          dark: "#000000",
          medium: "#747373ff",
          light: "#F2F2F2",
        },
        orange: {
          DEFAULT: "#FF6600",
          dark: "#be4e03ff",
          light: "#FFE6CC",
        },

        // 🎯 Colores personalizados para signos vitales
        vitals: {
          ritmo: {
            bg: "#FFF0F5", // rosa suave
            border: "#E91E63",
          },
          oxigenacion: {
            bg: "#E6F7FF", // azul suave
            border: "#2D9CDB",
          },
          temperatura: {
            bg: "#FFF8E1", // amarillo suave
            border: "#e0b403ff",
          },
        },
      },

      // ✨ Animaciones personalizadas
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        hoverCard: {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
          "100%": { transform: "scale(1.05)", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
        },
        "fade-in-up": {
        "0%": { opacity: 0, transform: "translateY(10px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
      },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        slideUp: "slideUp 0.4s ease-out",
        "hover-card": "hoverCard 0.3s ease-in-out forwards",
        "fade-in-up": "fade-in-up 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
