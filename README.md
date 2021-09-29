## DAOHaus Bookkeeping App

### Technologies

1. UI - Chakra UI, react-icons
2. Framework - Create React App
3. Forms - react-hook-form
4. DX - eslint, prettier, typescript, husky
5. Utilities - lodash, moment

### Getting started

1. Clone the repo
2. cd into the cloned repo and run `yarn`
3. `yarn start` to start the application

### How to add env variables?



1. Add your variable to .envrc, declare type in global.d.ts
2. open constants.ts and export your variable.
3. Import the variable from constants.

### How to use Tailwind + Chakra UI

Chakra UI borrows a lot of concepts from Tailwind and you will find their API very similar. However, after using chakra for few hours, I realised the layout features are not as rich as I thought and I had to install tailwind.

1. Use Tailwind CSS for layout and typography, avoid Chakra UI components + Typography
2. Use Chakra UI for all other components i.e. Forms, Data Display, Feedback, Overlay, Disclosure, Media and Icons.
3. In case you have a custom need, you might want to explore headless-ui/react package and build your UI.
4. Feel free to add Tailwind plugins, but make sure they dont conflict with Chakra UI

### VS Code extensions that you should install

Name: Code Spell Checker
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker

Name: ESLint
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

Name: Prettier - Code formatter
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

Name: Tailwind CSS IntelliSense
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
