import React from 'react';

import styled from 'styled-components';

import { theme } from '../../../styling/theme';

interface IProps {
  className?: string;
}

const OutlinedButton: React.FC<IProps> = props => (
  <button className={props.className}>{props.children}</button>
);

export default styled(OutlinedButton)`
  /* Sizing */
  height: 2.5em;
  margin: .5em calc(.5em + 5px) calc(.5em + 5px) .5em; /* We need to factor in
                                                          the box-shadow. */
  padding: .5em 2em;

  /* Positioning */
  position: relative;
  top: 0;
  left: 0;

  /* Remove defaults */
  outline: none;

  /* Border */
  border: 2px solid ${theme.accent};
  border-radius: 3px;

  /* Shadow of Mordor */
  box-shadow: 5px 5px 0px -2px white,
              5px 5px 0px 0px ${theme.accent};

  /* Other */
  cursor: pointer;

  /* Color */
  background: ${theme.accent};
  color: ${theme.accentSecond};

  /* Font */
  font-size: .9em;
  text-transform: uppercase;
  letter-spacing: .2px;
  font-weight: 800;

  /* Transition */
  transition: top .1s, left .1s, box-shadow .1s, color .1s;

  &:hover {
    top: 2px;
    left: 2px;
    box-shadow: 3px 3px 0px -2px white,
                3px 3px 0px 0px ${theme.accent};
  }

  &:active {
    top: 5px;
    left: 5px;
    box-shadow: 0px 0px 0px -2px white,
                0px 0px 0px 0px ${theme.accent};
    color: white;
  }
`;
