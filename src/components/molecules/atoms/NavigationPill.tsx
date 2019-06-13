import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { theme } from '../../../styling/theme';

interface IProps {
  to: string;
  className?: string;
  active: boolean;
}

const NavigationPill: React.FC<IProps> = ({ children, ...props }) => (
  <Link {...props}>
    {children}
  </Link>
);

export default styled(NavigationPill)`
  /* Positioning */
  display: inline-block;
  width: 100%;
  padding: 1em;

  /* Font */
  text-decoration: none;
  font-family: "Open Sans", sans-serif;

  /* Border */
  border-left: ${props => props.active ? `2px solid ${theme.main}` : 'none'};

  /* Colors */
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.9)'};
  background: ${props => props.active ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0)'};
`;
