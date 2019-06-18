import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
/* TODO: add theme props, add grid */
  background-color: ghostwhite;
  border-radius: 5px;
  box-shadow: 5px 5px 15px grey;
  padding: 20px;

`;

const CardContainer: React.FC = ({children, ...props}) => {
    return (
      <Wrapper {...props}>{children}</Wrapper>
    );
};

export default CardContainer;
