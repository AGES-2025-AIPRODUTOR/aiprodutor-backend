// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    // Ignore build output, config files, and all test files
    ignores: ["dist/", "eslint.config.mjs", "**/*.spec.ts"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended, // Use the base recommended rules, not the stricter "type-checked" ones
  eslintPluginPrettierRecommended,
  {
    rules: {
      // Turn off rules that are causing the most noise for now
      '@typescript-eslint/no-unused-vars': 'warn', // Warn about unused variables instead of erroring
      '@typescript-eslint/no-explicit-any': 'off', // Allow the use of 'any' type
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
);