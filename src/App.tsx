import React from 'react';

import { createGlobalStyle } from 'styled-components';

import { BrowserRouter, Route } from 'react-router-dom';

import FAQ from './components/FAQ';
import Homepage from './components/Homepage';

// Reset
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const App: React.FC = () => (
  <>
    <BrowserRouter>
      <Route path="/" exact={true} component={Homepage} />
      <Route path="/faq" component={FAQ} />
    </BrowserRouter>
    <GlobalStyle />
  </>
);

export default App;
