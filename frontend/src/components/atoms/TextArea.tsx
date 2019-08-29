import React from 'react';

import styled from 'styled-components';

import Label from './Label';

interface ITextAreaProps {
  className?: string;
  id: string;
  placeholder?: string;
  setState: React.Dispatch<React.SetStateAction<any>>;
  value: string | number;
}

const TextArea: React.FC<ITextAreaProps> = props => {
  const updateState = (e: React.FormEvent<HTMLTextAreaElement>) =>
    props.setState(e.currentTarget.value);

  return (
    <div className={props.className}>
      <Label htmlFor={props.id}>{props.children}</Label>
      <textarea
        value={props.value}
        onChange={updateState}
        id={props.id}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export default styled(TextArea)`
  grid-column: 1 / span 2;

  textarea {
    font-size: 0.8em;
    padding: 0.5em 0.75em;
    background: ${props => props.theme.palette.primary.main};
    border: 2px solid ${props => props.theme.palette.primary.contrast};
    border-radius: 3px;
    color: ${props => props.theme.palette.primary.contrast};
    outline: none;
    transition: background 0.1s, color 0.1s;
    width: 100%;
    height: 5em;

    &:focus {
      background: ${props => props.theme.palette.primary.contrast};
      color: ${props => props.theme.palette.primary.main};
    }
  }
`;
