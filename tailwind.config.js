/** @type {import('tailwindcss').Config} */
const typographyCss = {
  fontFamily: "FKGN, sans-serif",
  color: "#13333bcc",
  strong: {
    fontFamily: "FKGN, sans-serif",
    fontWeight: "600",
    color: "inherit",
  },
  b: {
    fontFamily: "FKGN, sans-serif",
    fontWeight: "600",
    color: "inherit",
  },
  p: {
    marginTop: "0.3rem",
    marginBottom: "0.3rem",
  },
  ul: {
    marginTop: "0.3rem",
    marginBottom: "0.3rem",
    paddingLeft: "1.5em",
  },
  ol: {
    marginTop: "0.3rem",
    marginBottom: "0.3rem",
    paddingLeft: "1.5em",
  },
  "ul > li": {
    fontFamily: "FKGN, sans-serif",
  },
  "ol > li": {
    fontFamily: "FKGN, sans-serif",
  },
  "ul > li::marker": {
    fontFamily: "FKGN, sans-serif",
    color: "#13333bcc",
  },
  "ol > li::marker": {
    fontFamily: "FKGN, sans-serif",
    color: "#13333bcc",
  },
  "li > p": {
    marginTop: "0",
    marginBottom: "0",
  },
};

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // backgroundImage: {
      //   'dotted-pattern': "radial-gradient(#000000 0.75px, #ffffff 0.75px)",
      // },
      // backgroundSize: {
      //   'dot-size': '15px 15px',
      // },
      fontFamily: {
        custom: ["PPEN", "FKGN"],
      },
      typography: {
        DEFAULT: {
          css: {
            ...typographyCss,
          },
        },
        sm: {
          css: {
            ...typographyCss,
          },
        },
        md: {
          css: {
            ...typographyCss,
          },
        },
        lg: {
          css: {
            ...typographyCss,
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          /* Primary: your darkest brand color */
          "primary":         "#091717", // Off Black
          "primary-content": "#FCFAF7", // Paper White

          /* Secondary: next-darkest for supporting elements */
          "secondary":       "#12353B", // Inky Blue
          "secondary-content":"#FCFAF7",

          /* Accent: a lighter pop color */
          "accent":          "#FFD2A6", // Apricot
          "accent-content":  "#091717", // Off Black

          /* Neutral tones */
          "neutral":         "#2E565D", // Peacock
          "neutral-content": "#FCFAF7",

          /* Base (background) layers: light → lighter → lightest */
          "base-100":        "#FCFAF7", // Paper White
          "base-200":        "#E5E3D5", // Ecru
          "base-300":        "#BADFDF", // Sky
          "base-content":    "#091717", // Off Black

          /* Semantic feedback colors */
          "info":            "#218190", // True Turquoise
          "info-content":    "#FCFAF7",

          "success":         "#21B8CD", // Plex Blue
          "success-content": "#FCFAF7",

          "warning":         "#A94B31", // Terra Cotta
          "warning-content": "#FCFAF7",

          "error":           "#954457", // Boysenberry
          "error-content":   "#FCFAF7",
        },
      }
    ],
  },
};
