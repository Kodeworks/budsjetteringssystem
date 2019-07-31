import React from 'react';

import styled from 'styled-components';

import Label from './Label';

interface ICheckboxProps {
  className?: string;
  id: string;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  value: boolean;
}

const Checkbox: React.FC<ICheckboxProps> = props => {
  const updateState = (e: React.FormEvent<HTMLInputElement>) =>
    props.setState(e.currentTarget.checked);

  return (
    <div className={props.className}>
      <Label htmlFor={props.id} checkboxLabel={true}>
        {props.children}
      </Label>
      <input
        defaultChecked={props.value}
        onChange={updateState}
        type="checkbox"
        id={props.id}
      />
    </div>
  );
};

export default styled(Checkbox)`
  label,
  input {
    vertical-align: middle;
  }

  input {
    -webkit-appearance: none;
    width: 1.5em;
    height: 1.5em;
    background: ${props => props.theme.palette.primary.main};
    border: 2px solid ${props => props.theme.palette.primary.contrast};
    border-radius: 3px;
    cursor: pointer;
    color: ${props => props.theme.palette.primary.contrast};
    outline: none;
    transition: background 0.1s, color 0.1s;

    &:focus {
      background: lightgrey;
      color: ${props => props.theme.palette.primary.main};
    }

    &[checked] {
      background: ${props => props.theme.palette.primary.contrast};
    }
  }
`;
