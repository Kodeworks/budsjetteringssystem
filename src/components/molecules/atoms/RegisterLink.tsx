import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { theme } from '../../../styling/theme';

interface IProps {
  className?: string;
  to: string;
}

const RegisterLink: React.FC<IProps> = props => (
  <Link to={props.to}><span className={props.className}>{props.children}</span></Link>
);

export default styled(RegisterLink)`
  color: ${theme.accent};
  font-family: "Open Sans", sans-serif;
  vertical-align: middle;
  margin-left: .7em;
  cursor: pointer;
`;
