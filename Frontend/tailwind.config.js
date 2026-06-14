export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0F1117",
        surface: "#171A22",
        border: "#2A2F3A",
        text: "#D6DCE5",
        accent: "#6366F1",
        success: "#10B981",
        danger: "#EF4444",
      },
      boxShadow: {
        glow: "0 20px 60px rgba(15, 17, 23, 0.35)",
      },
    },
  },
  plugins: [],
};
