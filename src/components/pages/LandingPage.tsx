import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import AccentedLink from '../atoms/AccentedLink';
import OutlinedButton from '../atoms/OutlinedButton';

interface ILandingPage {
  className?: string;
}

const BrandTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  text-transform: uppercase;
  font-size: 4em;
  font-weight: 300;
  color: ${props => props.theme.contrast};
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
  </div>
);

export default styled(LandingPage)`
  background: ${props => props.theme.main}

  padding: 0;

  /* Subcomponent styling */
  header {
    height: 100vh;
    margin-left: 15vw;

    /* Vertically align the content to the center */
    display: flex;

    &>* {
      align-self: center;
    }
  }

  p {
    color: ${props => props.theme.contrast};
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
