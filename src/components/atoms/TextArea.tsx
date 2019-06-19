import React from 'react';

import styled from 'styled-components';

interface IProps {
  className?: string;
  id: string;
  placeholder?: string;
  setState: React.Dispatch<React.SetStateAction<any>>;
  value: string | number;
}

const TextArea: React.FC<IProps> = props => {
  const updateState = (e: React.FormEvent<HTMLTextAreaElement>) => props.setState(e.currentTarget.value);

  return (
    <div className={props.className}>
      <label htmlFor={props.id}>{props.children}</label>
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

  label {
    display: block;
    font-size: .8em;
    margin-bottom: .2em;
    font-weight: 700;
    letter-spacing: .4px;
  }

  textarea {
    font-size: .8em;
    padding: .5em .75em;
    background: ${props => props.theme.accent1};
    border: 2px solid ${props => props.theme.contrast};
    border-radius: 3px;
    color: ${props => props.theme.contrast};
    outline: none;
    transition: background .1s, color .1s;
    width: 100%;
    height: 5em;

    &:focus {
      background: ${props => props.theme.contrast};
      color: ${props => props.theme.accent1};
    }
  }
`;
