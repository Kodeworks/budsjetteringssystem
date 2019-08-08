![Build - CircleCI](https://img.shields.io/circleci/build/github/Kodeworks/liquidator-frontend/master.svg)
![Deps](https://img.shields.io/david/kodeworks/liquidator-frontend.svg)
![Closed issues](https://img.shields.io/github/issues-closed/kodeworks/liquidator-frontend.svg)
![License](https://img.shields.io/github/license/kodeworks/liquidator-frontend.svg)

[**Milestones**](https://github.com/Kodeworks/liquidator-frontend/milestones) and [**Project Board**](https://github.com/Kodeworks/liquidator-frontend/projects/2)

[**Link to backend repo**](https://github.com/kodeworks/liquidator-backend)
# Liquidator [Frontend]

This is the frontend for liquidator.

To run this (with hot-reload), simply run the command

```bash
yarn start
```

If you wish to use storybook (to see the components in isolation), first install it:

```bash
npx -p @storybook/cli
```

And then run it by entering

```bash
yarn storybook
```

Other than that, it's just a create-react-app, so the normal `yarn build` etc. works!

To test the application, we have three different commands;

1. `yarn test` -- Runs the component and reducer tests. Does not require a backend running.
2. `yarn test:api` -- Only run the backend integration tests. Requires a running instance of [`liquidator-backend`](https://github.com/kodeworks/liquidator-backend).
3. `yarn test:all` -- Runs _everything_. Requires a running instance of `liquidator-backend`.

Happy hacking! :tada:
