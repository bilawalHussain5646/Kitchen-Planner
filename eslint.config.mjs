import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores([
    "dist/**",
    "out/**",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
