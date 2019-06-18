import React from 'react';

import styled from 'styled-components';

import { theme } from '../../styling/theme';

interface IProps {
  className?: string;
}

const AddButton: React.FC<IProps> = props => (
  <button className={props.className}>+</button>
);

export default styled(AddButton)`
  /* Sizing */
  height: 2em;
  width: 2em;
  margin: .5em calc(.5em + 4px) calc(.5em + 4px) .5em; /* We need to factor in
                                                          the box-shadow. */

  /* Positioning */
  position: relative;
  top: 0;
  left: 0;

  /* Remove defaults */
  outline: none;

  /* Border */
  border: 2px solid ${theme.contrast};
  border-radius: 3px;

  /* Shadow of Mordor */
  box-shadow: 4px 4px 7px 0px #ddd;

  /* Other */
  cursor: pointer;

  /* Color */
  background: ${theme.accent1};
  color: ${theme.contrast};

  /* Font */
  font-size: 1.3em;

  /* Transition */
  transition: top .1s, left .1s, box-shadow .1s, color .1s;

  &:hover {
    top: 2px;
    left: 2px;
    box-shadow: 2px 2px 7px 0px #ddd;
  }

  &:active {
    top: 4px;
    left: 4px;
    box-shadow: 0px 0px 7px 0px #ddd;
    color: white;
  }
`;
