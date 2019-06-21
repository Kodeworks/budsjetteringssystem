import React from 'react';

import styled from 'styled-components';

import Label from './Label';

interface IProps {
  className?: string;
  id: string;
  placeholder?: string;
  type: string;
  setState: React.Dispatch<React.SetStateAction<any>>;
  value: string | number;
}

const Input: React.FC<IProps> = props => {
  const updateState = (e: React.FormEvent<HTMLInputElement>) => props.setState(e.currentTarget.value);

  return (
    <div className={props.className}>
      <Label htmlFor={props.id}>{props.children}</Label>
      <input
        value={props.value}
        onChange={updateState}
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export default styled(Input)`
  input {
    font-size: .8em;
    padding: .5em .75em;
    background: ${props => props.theme.accent1};
    border: 2px solid ${props => props.theme.contrast};
    border-radius: 3px;
    color: ${props => props.theme.contrast};
    outline: none;
    transition: background .1s, color .1s;
    width: 100%;

    &:focus {
      background: ${props => props.theme.contrast};
      color: ${props => props.theme.accent1};
    }
  }
`;
