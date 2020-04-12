import styled from 'styled-components';

export default styled.button`
  background-color: ${props => props.theme.palette.primary.main};
  border: none;
  padding-right: 0.5em;
  float: right;
  position: absolute;
  right: 10px;
  top: 1.2em;
  color: ${props => props.theme.palette.primary.contrast};
  font-weight: 600;
  text-transform: uppercase;
  transition: 0.1s linear;
  margin-left: 1em;

  &:hover {
    color: ${props => props.theme.palette.danger.main};
    transition: 0.1s linear;
    cursor: pointer;
  }
`;
