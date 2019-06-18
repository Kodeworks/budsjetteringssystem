import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../../styling/theme';
import Toolbar from '../organism/Toolbar';

const Container = styled.div`
  padding: 4em;

  &>h1 {
    margin-bottom: 1em;
  }
`;

const Separator = styled.hr`
  height: 0px;
  border: 0;
  border-top: 1px solid #DFE4F6;
  border-bottom: 1px solid white;
`;

const Page: React.FC = props => (
  <section>
    <Toolbar />
    <ThemeProvider theme={theme}>
      <Separator />
    </ThemeProvider>
    <Container>
      {props.children}
    </Container>
  </section>
);

export default Page;
