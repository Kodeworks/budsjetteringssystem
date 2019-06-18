import React from 'react';
import styled from 'styled-components';

interface ICardContainerProps {

}

const Wrapper = styled.div`
/* TODO: add theme props */
  background-color: ghostwhite;
  border-radius: 5px;
  box-shadow: 5px 5px 15px grey;
  padding: 20px;
`;

const CardContainer: React.FC<ICardContainerProps> = ({children}) => {
    return (
      <Wrapper>{children}</Wrapper>
    );
};

export default CardContainer;
