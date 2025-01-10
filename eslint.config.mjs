import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat with the base directory of this config file
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extend the Next.js and TypeScript configs
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Custom rules
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Disable the unused-vars rule
      "@typescript-eslint/no-explicit-any": "off", // Disable the no-explicit-any rule
    },
  },
];

export default eslintConfig;
