import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { theme } from '../styling/theme';

import OutlinedButton from './molecules/atoms/OutlinedButton';
import RegisterLink from './molecules/atoms/RegisterLink';

interface ILandingPage {
  className?: string;
}

const BrandTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  text-transform: uppercase;
  font-size: 3em;
  font-weight: 300;
  color: white;
`;

const ButtonContainer = styled.div`
  padding-top: 1em;
`;

const TextContainer = styled.div`
  width: 30vw;
`;

const LandingPage: React.FC<ILandingPage> = ({ className }) => (
  <div className={className}>
    <header>
      <TextContainer>
        <BrandTitle>Liquidator</BrandTitle>
        <p>
          Adipisicing iusto maiores mollitia non deleniti? Et ullam porro omnis
          molestiae doloremque Dolore ut error quae culpa iure eius Quisquam.
        </p>
        <ButtonContainer>
          <Link to="/login">
            <OutlinedButton>Login</OutlinedButton>
          </Link>
          <RegisterLink to="/register">Don't have an account? Sign up</RegisterLink>
        </ButtonContainer>
      </TextContainer>
    </header>
  </div>
);

export default styled(LandingPage)`
  background-color: ${theme.primary};

  /* Subcomponent styling */
  header {
    height: 75vh;
    margin-left: 20vw;

    /* Vertically align the content to the center */
    display: flex;

    &>* {
      align-self: center;
    }
  }

  p {
    color: white;
    font-size: 1.2em;
  }

  /* Media queries */
  @media screen and (max-width: 600px) {
    header {
      width: 90vw;
      margin-left: 5vw;
    }
  }
`;
