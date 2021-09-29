module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'universe/web',
    'universe/shared/typescript-analysis',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
};
