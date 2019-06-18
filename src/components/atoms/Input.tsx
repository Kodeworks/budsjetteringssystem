import React from 'react';

import styled from 'styled-components';

import { theme } from '../../styling/theme';

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
      <label htmlFor={props.id}>{props.children}</label>
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
  label {
    display: block;
    font-size: .8em;
    margin-bottom: .2em;
    font-weight: 700;
    letter-spacing: .4px;
  }

  input {
    font-size: .8em;
    padding: .5em .75em;
    background: ${theme.accent1};
    border: 2px solid ${theme.contrast};
    border-radius: 3px;
    color: ${theme.contrast};
    outline: none;
    transition: background .1s, color .1s;
    width: 100%;

    &:focus {
      background: ${theme.contrast};
      color: ${theme.accent1};
    }
  }
`;
