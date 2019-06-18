import { configure } from '@storybook/react';
import { addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';

// Option defaults.
addParameters({
  options: {
    theme: themes.normal,
  },
});

const req = require.context('../src/stories', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
