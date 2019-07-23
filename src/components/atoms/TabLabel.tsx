import React from 'react';
import styled from 'styled-components';

interface IProps {
  isActive: boolean;
  className?: string;
  label: string;
  onClick: (label: string) => void;
}

const LI = styled.li`
  display: inline-block;
  list-style: none;
  margin: 0px 2px;
  padding: 0.5rem 0.75rem;
  height 100%;
  font-size: 0.9em;
`;

const TabLabel: React.FC<IProps> = props => {
  const handleTabClick = () => {
    props.onClick(props.label);
  };
  return (
    <LI 
      className={props.className}
      onClick={handleTabClick} 
      role="tab"
      aria-selected={props.isActive}
      id={props.label}
      aria-controls={`${props.label}-tab`}
    >
      <button>{props.children}</button>
    </LI>
  );
};

export default styled(TabLabel)`
  background-color: ${props =>
    (props.isActive ? props.theme.palette.background.paper : '#e1e1de')};
  border-top-left-radius: ${props => props.theme.shape.borderRadius};
  border-top-right-radius: ${props => props.theme.shape.borderRadius};
  box-shadow: ${props => (props.isActive ? '0 -2px 2px 0 #3c6578' : '')};
  /*z-index: ${props => (props.isActive ? 301 : -300)};*/
  
  :hover {
    cursor: pointer;
  }
  button {
    background-color: ${props =>
      props.isActive ? props.theme.palette.background.paper : '#e1e1de'}
    box-shadow: 0 0 0 #ccc; 
    font-weight: ${props => (props.isActive ? '700': '')};
    border: none;
  }
`;
