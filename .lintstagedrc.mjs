// This file should be named .lintstagedrc.mjs for ESM support in Node.js with "type": "module".
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const buildEslintCommand = (filenames) =>
  `npx eslint --fix ${filenames.map((f) => path.relative(__dirname, f)).join(' ')}`;

export default {
  'src/**/*.{ts,tsx}': () => ['npx tsc --noEmit'],
  'src/**/*.{js,jsx,ts,tsx,json,md,prettierrc,css,scss}': ['prettier --write --config .prettierrc'],
  'src/**/*.{js,jsx,ts,tsx}': [buildEslintCommand],
};
åå;
