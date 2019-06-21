import React from 'react';

import styled from 'styled-components';

import Label from './Label';

interface ISelectProps extends React.HTMLProps<HTMLSelectElement> {
  values: Array<{ name: string, value: string }>;

  value: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const Select: React.FC<ISelectProps> = ({values, value, setState, ...props}) => {
  const onSelected = (e: React.FormEvent<HTMLSelectElement>) => setState(e.currentTarget.value);

  return (
    <div>
      <Label htmlFor={props.id}>{props.children}</Label>
      <select {...props} onChange={onSelected} value={value}>
        {values.map(e => (<option key={e.name} value={e.value}>{e.name}</option>))}
      </select>
    </div>
  );
};

export default styled(Select)`
  background: none;
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
`;
