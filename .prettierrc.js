/** @type {import('prettier').Config} */
module.exports = {
  // Specify the line length that the printer will wrap on
  printWidth: 100,

  // Specify the number of spaces per indentation-level
  tabWidth: 2,

  // Use spaces instead of tabs
  useTabs: false,

  // Print semicolons at the ends of statements
  semi: true,

  // Use single quotes instead of double quotes
  singleQuote: true,

  // Print trailing commas wherever possible in multi-line comma-separated syntactic structures
  trailingComma: 'es5',

  // Print spaces between brackets in object literals
  bracketSpacing: true,

  // Include parentheses around a sole arrow function parameter
  arrowParens: 'avoid',

  // Do not use single quotes in JSX
  jsxSingleQuote: false,

  // Put the > of a multi-line JSX element at the end of the last line instead of alone on the next line
  bracketSameLine: false,

  // Specify the line endings used in the file
  endOfLine: 'lf',

  // Format certain file extensions
  overrides: [
    {
      files: ['*.json', '*.yml'],
      options: {
        tabWidth: 2,
      },
    },
  ],
};
