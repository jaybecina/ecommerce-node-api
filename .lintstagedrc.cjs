const path = require('path');

const buildEslintCommand = (filenames) =>
  `npx eslint --fix ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;

module.exports = {
  'src/**/*.{ts,tsx}': () => ['npx tsc --noEmit'],
  'src/**/*.{js,jsx,ts,tsx,json,md,prettierrc,css,scss}': ['prettier --write --config .prettierrc'],
  'src/**/*.{js,jsx,ts,tsx}': [buildEslintCommand],
};
