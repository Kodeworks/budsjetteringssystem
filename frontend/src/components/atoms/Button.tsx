import styled from 'styled-components';

const Button = styled.button`
  -webkit-appearance: none;
  background: none;
  border: 2px solid ${props => props.theme.palette.primary.contrast};
  color: ${props => props.theme.palette.primary.contrast};
  border-radius: 3px;
  padding: 0.5em 1em;
  outline: none;
  cursor: pointer;
  font-size: 0.7em;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  font-weight: 800;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${props => props.theme.palette.primary.contrast};
    color: white;
  }
`;

export const DangerZoneButton = styled(Button)`
  &:hover {
    background: ${props => props.theme.palette.danger.main};
    border-color: ${props => props.theme.palette.danger.main};
    color: ${props => props.theme.palette.primary.main};
  }
`;

export default Button;
