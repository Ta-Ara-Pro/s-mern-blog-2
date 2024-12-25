// const flowbite = require("flowbite-react/tailwind");

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//     flowbite.content(),
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     flowbite.plugin(),
//     require('tailwind-scrollbar'),
//     // require('@tailwindcss/line-clamp'),
//   ],
// }


/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js", // For flowbite-react components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindScrollbar,
    // require("@tailwindcss/line-clamp"),
  ],
};




