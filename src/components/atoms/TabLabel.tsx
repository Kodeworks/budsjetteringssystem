import React from 'react';
import styled from 'styled-components';

interface ITabLabelProps {
  isActive: boolean;
  className?: string;
  label: string;
  onClick: (label: string) => void;
}

const Button = styled.button`
  display: inline-block;
  list-style: none;
  margin: 0px 4px;
  padding: 0.5rem 0.75rem 0.75rem 0.75rem;
  height: 100%;
  font-size: 0.9em;
  vertical-align: middle;
`;

const TabLabel: React.FC<ITabLabelProps> = props => {
  const handleTabClick = () => {
    props.onClick(props.label);
  };
  return (
    <Button
      className={props.className}
      onClick={handleTabClick}
      role="tab"
      aria-selected={props.isActive}
      id={props.label}
      aria-controls={`${props.label}-tab`}
    >
      {props.children}
    </Button>
  );
};

export default styled(TabLabel)`
  background-color: ${props =>
    props.isActive ? props.theme.palette.background.paper : '#eee'};
  border: none;
  border-top-left-radius: ${props => props.theme.shape.borderRadius};
  border-top-right-radius: ${props => props.theme.shape.borderRadius};
  border-bottom: ${props =>
    !props.isActive ? 'solid 1.5px rgba(204,204,204, .5)' : 'none'};
  box-shadow: 2px -2px 3px 0 #ccc;
  font-weight: ${props => (props.isActive ? '700' : '')};
  z-index: ${props => (props.isActive ? 301 : -300)};

  :hover {
    cursor: pointer;
  }
`;
