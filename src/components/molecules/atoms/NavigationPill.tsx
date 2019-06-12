import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

  /* Border */
  border-left: ${props => props.active ? '2px solid white' : 'none'};

  /* Colors */
  color: ${props => !props.active ? 'rgba(255, 255, 255, 0.8)' : 'white'};
  background-color: ${props => props.active ? '#7540E8' : 'rgba(0, 0, 0, 0)'};
`;
