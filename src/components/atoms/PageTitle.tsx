import React from 'react';
import styled from 'styled-components';

interface ITitleProps {
  className?: string;
  title: string;
  description?: string;
}

const Title: React.FC<ITitleProps> = props => {
  return (
    <div className={props.className}>
      <h1>{props.title}</h1>
      <h5>{props.description}</h5>
    </div>
  );
};

export default styled(Title)`
  margin-bottom: 4em;
`;
