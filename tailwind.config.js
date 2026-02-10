/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#f0f0f0",
        foreground: "#0A0A0A",
        muted: "#525252",
        card: "#ffffff",
        border: "#D4D4D4",
        primary: "#440808ff",
        'primary-foreground': "#ffffffff",
        secondary: "#272725",
        success: "#00B517",
        warning: "#FE9A00",
        danger: "#FF3B30",
        info: "#1447E6",
        'accent-green': "#00B517",
        'accent-orange': "#FE9A00",
        'accent-red': "#FF3B30",
        'accent-blue': "#1447E6",
      },
    },
  },
  plugins: [],
};
