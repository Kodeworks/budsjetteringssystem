import React from 'react';
import SnackBarCloseButton from './SnackBarCloseButton';
import SnackBarLoader from './SnackBarLoader';
import styled from 'styled-components';
import { theme } from '../../styling/theme';

interface ISnackBarProps {
  className?: string;
  clicker?: () => void;
  content: string;
  good: boolean;
  speed?: string;
}

const LoaderSpeed = (speed = '6s') => {
  if (speed === 'fast') {
    return '4s';
  } else if (speed === 'slow') {
    return '8s';
  } else {
    return '6s';
  }
};

const SnackBarContainer: React.FC<ISnackBarProps> = ({
  className,
  clicker,
  content,
  good,
  speed,
}) => {
  return (
    <div className={className}>
      <p>{content}</p>
      <SnackBarCloseButton onClick={clicker}>x</SnackBarCloseButton>
      <SnackBarLoader
        style={{
          animationDuration: LoaderSpeed(speed),
        }}
      />
    </div>
  );
};

export default styled(SnackBarContainer)`
  color: ${theme.palette.primary.contrast};
  background-color: ${theme.palette.background.default};
  padding: 0.5em;
  border-radius: 3px;
  border: 3px solid;
  border-color: ${props =>
    props.good ? theme.palette.success.main : theme.palette.danger.main};
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: inline-block;
  min-width: 200px;
  max-width: 70vw;
  padding-left: 1em;
  -webkit-box-shadow: 10px 10px 16px -7px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px 10px 16px -7px rgba(0, 0, 0, 0.75);
  box-shadow: 10px 10px 16px -7px rgba(0, 0, 0, 0.75);

  & > p {
    width: 100%;
    padding-right: 4em;
  }
`;
