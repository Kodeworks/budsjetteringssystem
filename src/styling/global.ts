import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300|Open+Sans:300,400,700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: "Open Sans", sans-serif;
  }

  h1 {
    font-weight: 400;
    font-size: 2em;
  }

  h1, h2, h3, h4, h5, h6, a, p, label {
    color: ${theme.primary}
  }
`;
