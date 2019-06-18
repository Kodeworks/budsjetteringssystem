import React from 'react';

import styled from 'styled-components';

import { theme } from '../../styling/theme';

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
      <label htmlFor={props.id}>{props.children}</label>
      <input defaultChecked={props.value} onChange={updateState} type="checkbox" id={props.id}/>
    </div>
  );
};

export default styled(Checkbox)`
  label, input {
    vertical-align: middle;
  }

  label {
    margin-right: .7em;
    font-size: .8em;
    margin-bottom: .2em;
    font-weight: 700;
    letter-spacing: .4px;
  }

  input {
    -webkit-appearance: none;
    width: 1.5em;
    height: 1.5em;
    background: ${theme.accent1};
    border: 2px solid ${theme.contrast};
    border-radius: 3px;
    cursor: pointer;
    color: ${theme.contrast};
    outline: none;
    transition: background .1s, color .1s;

    &:focus {
      background: lightgrey;
      color: ${theme.accent1};
    }

    &[checked] {
      background: ${theme.contrast};
    }
  }
`;
