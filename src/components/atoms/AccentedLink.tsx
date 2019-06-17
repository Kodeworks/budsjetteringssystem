import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { theme } from '../../styling/theme';

interface IProps {
  className?: string;
  to: string;
}

const AccentedLink: React.FC<IProps> = props => (
  <Link style={{ textDecoration: 'none' }} to={props.to}>
    <span className={props.className}>{props.children}</span>
  </Link>
);

export default styled(AccentedLink)`
  color: ${theme.contrast};
  font-family: "Open Sans", sans-serif;
  vertical-align: middle;
  margin-left: .7em;
  cursor: pointer;
`;
