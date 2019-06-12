import React from 'react';

import styled, { ThemeProvider } from 'styled-components';

import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './styling/theme';

import FAQ from './components/FAQ';
import Homepage from './components/Homepage';
import Navigation from './components/molecules/Navigation';
import { GlobalStyle } from './styling/global';
import { navbarWidth } from './styling/sizes';

interface IProps {
  className?: string;
}

const App: React.FC<IProps> = ({ className }) => (
  <div className={className}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Navigation />
      </ThemeProvider>

      <Route path="/" exact={true} component={Homepage} />
      <Route path="/faq" component={FAQ} />
    </BrowserRouter>
    <GlobalStyle />
  </div>
);

export default styled(App)`
  /* Grid */
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: ${navbarWidth} auto;

  /* Colors */
  background-color: #F8F9FD;
`;
