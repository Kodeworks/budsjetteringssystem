import React from 'react';

import styled, { ThemeProvider } from 'styled-components';

import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './styling/theme';

import FAQ from './components/FAQ';
import Homepage from './components/Homepage';
import Navigation from './components/molecules/Navigation';
import Page from './components/molecules/Page';
import { GlobalStyle } from './styling/global';
import { navbarWidth } from './styling/sizes';

interface IProps {
  className?: string;
}

const App: React.FC<IProps> = ({ className }) => (
  <ThemeProvider theme={theme}>
    <div className={className}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Navigation />
        </ThemeProvider>

        <Page>
          <Route path="/" exact={true} component={Homepage} />
          <Route path="/faq" component={FAQ} />
        </Page>
      </BrowserRouter>
      <GlobalStyle />
    </div>
  </ThemeProvider >
);

export default styled(App)`
  /* Grid */
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: ${navbarWidth} auto;

  /* Colors */
  background-color: ${props => props.theme.backgroundColor};
`;
