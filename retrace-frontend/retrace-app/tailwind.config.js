/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#F3F4F7",
          100: "#E4E6EC",
          300: "#9AA1B4",
          500: "#5A6178",
          700: "#2C3149",
          900: "#101425",
        },
        paper: "#F7F7F5",
        indigo: {
          50: "#EEF0FD",
          100: "#DCE0FB",
          400: "#5D6FE0",
          500: "#3B4CC9",
          600: "#2E3EA6",
          700: "#242F80",
        },
        signal: {
          teal: "#0E8F72",
          amber: "#B9740B",
          rose: "#C0405A",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "22px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 20, 37, 0.04)",
        panel: "0 8px 30px rgba(16, 20, 37, 0.08)",
      },
    },
  },
  plugins: [],
}
