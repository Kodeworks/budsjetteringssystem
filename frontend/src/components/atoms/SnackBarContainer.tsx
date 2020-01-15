import React from 'react';

import styled from 'styled-components';
import SnackBarCloseButton from './SnackBarCloseButton';
import { theme } from '../../styling/theme';
import SnackBarSymbol from './SnackBarSymbol';

interface ISnackBarProps {
  content: string;
  good: boolean;
  className?: string;
}

const SnackBarContainer: React.FC<ISnackBarProps> = ({
  content,
  good,
  className,
}) => {
  return (
    <div className={className}>
      <p>
        <SnackBarSymbol>{good ? '✓' : '!'}</SnackBarSymbol>
        {content}
        <SnackBarCloseButton>X</SnackBarCloseButton>
      </p>
    </div>
  );
};

export default styled(SnackBarContainer)`
  color: ${props => (props.good ? 'green' : 'red')};
  background-color: ${props =>
    props.good ? theme.palette.success : theme.palette.error};
  padding: 0.5em;
  border-radius: 2px;
  border: 3px solid;
  border-color: ${props => (props.good ? 'green' : 'red')};
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: inline-block;
  min-width: 200px;
  padding-left: 1em;
  -webkit-box-shadow: 10px 10px 16px -7px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px 10px 16px -7px rgba(0, 0, 0, 0.75);
  box-shadow: 10px 10px 16px -7px rgba(0, 0, 0, 0.75);

  & > p {
    width: 100%;
  }
`;
