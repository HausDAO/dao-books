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

### How to use Tailwind + Chakra UI

Chakra UI borrows a lot of concepts from Tailwind and you will find their API very similar. However, after using chakra for few hours, I realised the layout features are not as rich as I thought and I had to install tailwind.

1. Use Tailwind CSS for layout and typography, avoid Chakra UI components + Typography
2. Use Chakra UI for all other components i.e. Forms, Data Display, Feedback, Overlay, Disclosure, Media and Icons.
3. In case you have a custom need, you might want to explore headless-ui/react package and build your UI.
4. Feel free to add Tailwind plugins, but make sure they dont conflict with Chakra UI
