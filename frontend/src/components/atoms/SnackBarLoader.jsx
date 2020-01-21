import React from 'react';
import styled from 'styled-components';
import { keyframes } from 'styled-components';

const shrinkBar = keyframes`
from {
  width: 100%;
}
to {
  width: 0%;
}
`;

export default styled.div`
  width: 100%;
  height: 5px;
  background-color: grey;
  padding: 0;
  margin: 0;
  position: absolute;
  bottom: 0px;
  left: 0px;
  animation-name: ${shrinkBar};
  animation-duration: 8s;
  animation-iteration-count: 1;
  animation-timing-function: linear;
`;
