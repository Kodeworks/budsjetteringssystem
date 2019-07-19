import React from 'react';

import { Link, LinkProps } from 'react-router-dom';
import styled from 'styled-components';

interface IProps extends LinkProps {
  className?: string;
  to: string;
}

const AccentedLink: React.FC<IProps> = ({
  to,
  className,
  children,
  ...props
}) => (
  <Link style={{ textDecoration: 'none' }} to={to} {...props}>
    <span className={className}>{children}</span>
  </Link>
);

export default styled(AccentedLink)`
  color: ${props => props.theme.palette.primary.contrast};
  font-family: 'Open Sans', sans-serif;
  vertical-align: middle;
  margin-left: 0.7em;
  cursor: pointer;
`;
