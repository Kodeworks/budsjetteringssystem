import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300|Open+Sans:300,400,700&display=swap');

  /* Global rules */

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${theme.accent1};
  }

  /* Typography */

  h1, h2, h3, h4, h5, h6, p, a, span, li, strong, label, input {
    font-family: "Open Sans", sans-serif;
  }

  h1 {
    font-weight: 400;
    font-size: 2em;
  }

  p {
    font-family: Montserrat;
    font-weight: 400;

    margin: .75em 0;
  }
`;
