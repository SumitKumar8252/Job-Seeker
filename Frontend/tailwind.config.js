export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#fff7ed",
        coral: "#f97316",
        ink: "#0f172a",
        mist: "#f8fafc",
      },
      boxShadow: {
        panel: "0 32px 90px -36px rgba(15,23,42,0.35)",
        soft: "0 20px 60px -32px rgba(15,23,42,0.25)",
        glow: "0 0 0 1px rgba(251,146,60,0.12), 0 18px 54px -28px rgba(249,115,22,0.28)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        shimmer: "shimmer 12s linear infinite",
        pulseSoft: "pulseSoft 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
