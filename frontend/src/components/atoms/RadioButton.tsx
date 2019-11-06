import React from 'react';
import styled from 'styled-components';

interface IRadioButtonProps {
  setState: React.Dispatch<React.SetStateAction<any>>;
  checked: boolean;
}

const RadioButton: React.FC<
  IRadioButtonProps & React.HTMLProps<HTMLInputElement>
> = props => {
  const onChange: React.MouseEventHandler = () => props.setState(props.value);

  return (
    <div className={props.className} onClick={onChange}>
      <span>{props.children}</span>
      <input
        readOnly={true}
        type="radio"
        name={props.name}
        checked={props.checked}
        id={`radio${props.name}-${props.value}`}
      />
    </div>
  );
};

export default styled(RadioButton)`
  input {
    margin-right: 0.5em;
    align-self: center;
  }

  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-size: 0.8em;
  padding: 0.5em 0.75em;
  background: ${props => props.theme.palette.primary.main};
  border: 2px solid ${props => props.theme.palette.primary.contrast};
  border-radius: 3px;
  color: ${props => props.theme.palette.primary.contrast};
  outline: none;
  transition: background 0.1s, color 0.1s;

  ${props =>
    props.checked &&
    `background: ${props.theme.palette.primary.contrast}; color: ${props.theme.palette.primary.main};`}
`;
