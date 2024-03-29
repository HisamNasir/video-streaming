import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#FF0000",
              foreground: "#ffffff",
            },
            focus: "#FF0000",
          },
        },
        light: {
          colors: {
            primary: {
              DEFAULT: "#FF0000",
              foreground: "#ffffff",
            },
            focus: "#FF0000",
          },
        },
      },
    }),
  ],
};
export default config;
