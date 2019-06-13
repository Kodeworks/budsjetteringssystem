import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { theme } from '../styling/theme';

import AccentedLink from './molecules/atoms/AccentedLink';
import BenefitGrid from './molecules/atoms/BenefitGrid';
import OutlinedButton from './molecules/atoms/OutlinedButton';

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
          <Link to="/register">
            <OutlinedButton>Join now</OutlinedButton>
          </Link>
          <AccentedLink to="/login">Already have an account? Sign in</AccentedLink>
        </ButtonContainer>
      </TextContainer>
    </header>
    <section>
      <h2>What separates Liquidator from the rest?</h2>
      <BenefitGrid />
    </section>
  </div>
);

export default styled(LandingPage)`
  background-color: ${theme.primary};
  padding-bottom: 4em;

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

  section {
    background: ${theme.primary};

    h2 {
      font-weight: 300;
      color: white;
      font-size: 1.8em;
      margin-bottom: 1em;
    }

    width: 70vw;
    margin: auto;
    padding: 2em;
    box-shadow: 0px 0px 20px 0px ${theme.secondary};
  }

  /* Media queries */
  @media screen and (max-width: 600px) {
    header {
      width: 90vw;
      margin-left: 5vw;
    }
  }
`;
