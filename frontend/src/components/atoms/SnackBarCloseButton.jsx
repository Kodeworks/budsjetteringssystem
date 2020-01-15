import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styling/theme';

export default styled.span`
  padding-right: 0.5em;
  float: right;
  color: ${theme.palette.primary.contrast};
  font-weight: 600;
  transition: 0.1s linear;
  margin-left: 1em;

  &:hover {
    color: red;
    transition: 0.1s linear;
    cursor: pointer;
  }
`;
