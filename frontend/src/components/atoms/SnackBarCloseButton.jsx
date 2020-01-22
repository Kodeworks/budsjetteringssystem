import styled from 'styled-components';
import { theme } from '../../styling/theme';

export default styled.button`
  background-color: ${theme.palette.primary.main};
  border: none;
  padding-right: 0.5em;
  float: right;
  position: absolute;
  right: 10px;
  top: 1.2em;
  color: ${theme.palette.primary.contrast};
  font-weight: 600;
  text-transform: uppercase;
  transition: 0.1s linear;
  margin-left: 1em;

  &:hover {
    color: ${theme.palette.danger.main};
    transition: 0.1s linear;
    cursor: pointer;
  }
`;
