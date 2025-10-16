import type { Config } from "tailwindcss";
import { tailwindPreset } from "@jn7agm02tf5q7xnzs3esvhz0c97sknhc/design-tokens/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{{ts,tsx}}"],
  plugins: [],
};

export default config;
