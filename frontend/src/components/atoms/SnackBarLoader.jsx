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
  height: 5px;
  background-color: ${props => props.theme.palette.primary.contrast};
  padding: 0;
  margin: 0;
  position: absolute;
  bottom: 0px;
  left: 0px;
  animation-name: ${shrinkBar};
  animation-duration: 8s;
  animation-iteration-count: 1;
  animation-timing-function: linear;
  border-radius: 0 3px 3px 0;
`;
