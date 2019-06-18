import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styling/theme';
import Toolbar from '../organism/Toolbar';

const Container = styled.div`
  padding: 4em;

  &>h1 {
    margin-bottom: 1em;
  }
`;

const Page: React.FC = props => (
  <section>
    <Toolbar />
    <Container>
      {props.children}
    </Container>
  </section>
);

export default Page;
