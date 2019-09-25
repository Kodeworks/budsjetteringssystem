import React from 'react';

import styled from 'styled-components';

import Label from './Label';

interface ISelectProps extends React.HTMLProps<HTMLSelectElement> {
  values: Array<{ name: string; value: any }>;
  value: any;
  setState: (value: any) => void;
}

const Select: React.FC<ISelectProps> = ({
  values,
  value,
  setState,
  ...props
}) => {
  const onSelected = (e: React.FormEvent<HTMLSelectElement>) => {
    setState(e.currentTarget.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div>
      <Label htmlFor={props.id}>{props.children}</Label>
      <select {...props} onChange={onSelected} value={value}>
        {values.map(e => (
          <option key={e.name} value={e.value}>
            {e.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default styled(Select)`
  background: none;
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
`;
