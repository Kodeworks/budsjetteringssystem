import React from 'react';
import styled from 'styled-components';
import SnackBarCloseButton from './SnackBarCloseButton';
import SnackBarLoader from './SnackBarLoader';

interface ISnackBar {
  className?: string;
  snackBarCloseHandler?: React.MouseEventHandler<HTMLButtonElement>;
  content: string;
  good: boolean;
  speed?: number;
}

const loaderSpeed = (speed: number = 6000) => {
  switch (speed) {
    case 4000:
      return '4s';
    case 6000:
      return '6s';
    case 8000:
      return '8s';
  }
};

const SnackBarContainer: React.FC<ISnackBar> = ({
  className,
  snackBarCloseHandler,
  content,
  speed,
}) => {
  return (
    <div className={className}>
      <p>{content}</p>
      <SnackBarCloseButton onClick={snackBarCloseHandler}>
        x
      </SnackBarCloseButton>
      <SnackBarLoader
        style={{
          animationDuration: loaderSpeed(speed),
        }}
      />
    </div>
  );
};

export default styled(SnackBarContainer)`
  color: ${props => props.theme.palette.primary.contrast};
  background-color: ${props => props.theme.palette.background.default};
  padding: 0.5em;
  border-radius: 3px;
  border: 3px solid;
  border-color: ${props =>
    props.good
      ? props.theme.palette.success.main
      : props.theme.palette.danger.main};
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
