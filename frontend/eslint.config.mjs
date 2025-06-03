import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  compat.config({
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "react/react-in-jsx-scope": "off", // Next.js handles React import automatically
      "react/jsx-uses-react": "off", // Next.js handles React usage automatically
    }
  }),
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
