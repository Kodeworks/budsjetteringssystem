import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';

import App from '../App';
import Navigation from '../components/molecules/Navigation';
import { navbarWidth } from '../styling/sizes';
import { GlobalStyle } from '../styling/global';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styling/theme';
import NavigationBrand from '../components/molecules/atoms/NavigationBrand';
import NavigationPill from '../components/molecules/atoms/NavigationPill';
import Toolbar from '../components/molecules/Toolbar';
import AddButton from '../components/molecules/atoms/AddButton';
import OutlinedButton from '../components/molecules/atoms/OutlinedButton';

addDecorator(storyFn => (
  <>
    <GlobalStyle />
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {storyFn()}
      </ThemeProvider>
    </BrowserRouter>
  </>
));


storiesOf('Navigation', module)
  .add('Full', () => (
    <Navigation />
  ))
  .add('Brand', () => (
    <div style={{ width: navbarWidth, backgroundImage: theme.navigationGradient, display: 'flex', flexDirection: "column" }}>
      <NavigationBrand />
    </div>
  ));

storiesOf('Navigation/Pill', module)
  .addDecorator(fn => <div style={{ width: navbarWidth, padding: '1em', backgroundImage: theme.navigationGradient }}>{fn()}</div>)
  .add('Pill // inactive', () => <NavigationPill to="/" active={false}>Inactive</NavigationPill>)
  .add('Pill // active', () => <NavigationPill to="/" active={true}>Active</NavigationPill>);

storiesOf('App', module)
  .add('Full', () => <App />);

storiesOf('Toolbar', module)
  .add('Default', () => <Toolbar />);

storiesOf('Button/Add', module)
  .add('Normal', () => <AddButton />);

storiesOf('Button/Outlined', module)
  .add('Normal', () => <OutlinedButton>Lipsum</OutlinedButton>);
