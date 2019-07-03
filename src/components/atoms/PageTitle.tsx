import React from 'react';
import styled from 'styled-components';

interface IProps {
  className?: string;
  title: string;
  description?: string;
}

const Title: React.FC<IProps> = (props) => {

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
