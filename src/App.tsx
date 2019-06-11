import React from 'react';

import { createGlobalStyle, ThemeProvider } from 'styled-components';

import Heading from './components/molecules/atoms/Heading';

// Reset
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const App: React.FC = () => (
  <ThemeProvider theme={{}} /* Insert theme specific variables here */>
    <>
      {/* ThemeProvider can only have one child */}
      <Heading>Welcome to Liquidator</Heading>
      <h5>welcome</h5>
      <GlobalStyle />
    </>
  </ThemeProvider>
);

export default App;
