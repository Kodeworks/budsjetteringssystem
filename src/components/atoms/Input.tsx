import React from 'react';

import styled from 'styled-components';

import { string } from 'prop-types';
import Label from './Label';

interface IProps {
  className?: string;
  id: string;
  placeholder?: string;
  type: string;
  setState?: React.Dispatch<React.SetStateAction<any>>;
  value?: string | number;
  ariaLabel?: string;
}

const Input: React.FC<IProps> = props => {
  const updateState = (e: React.FormEvent<HTMLInputElement>) =>
    props.setState ? props.setState(e.currentTarget.value) : null;
  return (
    <div className={props.className}>
      <Label htmlFor={props.id}>{props.children}</Label>
      <input
        value={props.value}
        onChange={updateState}
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
        aria-label={props.ariaLabel}
      />
    </div>
  );
};

export default styled(Input)`
  input {
    font-size: 0.8em;
    padding: 0.5em 0.75em;
    background: ${props => props.theme.palette.primary.main};
    border: 2px solid ${props => props.theme.palette.primary.contrast};
    border-radius: 3px;
    color: ${props => props.theme.palette.primary.contrast};
    outline: none;
    transition: background 0.1s, color 0.1s;
    width: 100%;

    &:focus {
      background: ${props => props.theme.palette.primary.contrast};
      color: ${props => props.theme.palette.primary.main};
    }
  }
`;
