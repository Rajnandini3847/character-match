import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#F4F1EA",
        ink: "#191919",
        terracotta: "#C46A4B",
        sage: "#8FA787",
        plum: "#6B4A6F",
        butter: "#F0CB69",
      },
    },
  },
  plugins: [],
};
export default config;
