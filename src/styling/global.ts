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

  h1, h2, h3, h4, h5, h6, p, a, span, li {
    font-family: "Open Sans", sans-serif;
    color: ${theme.contrast};
  }

  h1 {
    font-weight: 400;
    font-size: 2em;
  }

  h1, h2, h3, h4, h5, h6, a, p, label {
    color: ${theme.contrast}
  }

  p {
    font-family: Montserrat;
    font-weight: 400;

    margin: .75em 0;
  }
`;
