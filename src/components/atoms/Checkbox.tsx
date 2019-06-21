import React from 'react';

import styled from 'styled-components';

import Label from './Label';

interface IProps {
  className?: string;
  id: string;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  value: boolean;
}

const Checkbox: React.FC<IProps> = props => {
  const updateState = (e: React.FormEvent<HTMLInputElement>) => props.setState(e.currentTarget.checked);

  return (
    <div className={props.className}>
      <Label htmlFor={props.id} checkboxLabel={true}>{props.children}</Label>
      <input defaultChecked={props.value} onChange={updateState} type="checkbox" id={props.id}/>
    </div>
  );
};

export default styled(Checkbox)`
  label, input {
    vertical-align: middle;
  }

  input {
    -webkit-appearance: none;
    width: 1.5em;
    height: 1.5em;
    background: ${props => props.theme.accent1};
    border: 2px solid ${props => props.theme.contrast};
    border-radius: 3px;
    cursor: pointer;
    color: ${props => props.theme.contrast};
    outline: none;
    transition: background .1s, color .1s;

    &:focus {
      background: lightgrey;
      color: ${props => props.theme.accent1};
    }

    &[checked] {
      background: ${props => props.theme.contrast};
    }
  }
`;
