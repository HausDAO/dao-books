## DAOHaus Bookkeeping App

### Technologies

1. UI - Chakra UI, react-icons
2. Framework - Next.js
3. Forms - react-hook-form
4. DX - eslint, prettier, typescript, husky
5. Utilities - lodash, moment

### Getting started

1. Clone the repo
2. cd into the cloned repo and run `yarn`
3. `yarn dev` to start the application

### How to add env variables?

I am a fan of run-time variables as against build-time variables that Next.js recommends. This is because, we would like to always build the project once, and run it on multiple environments with different run-time variables.

In order to do that, I had to compromise on Automatic Static Optimisation across the app. Check \_app.tsx for more details.

1. Add your variable to next.config.js, declare type in global.d.ts
2. open constants.ts and export your variable.
3. Import the variable from constants.
