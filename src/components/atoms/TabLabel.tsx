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
  margin-bottom: -2px;
  padding: 0.5rem 0.75rem;
  height 100%;
`;

const TabLabel: React.FC<IProps> = props => {
  const handleTabClick = () => {
    props.onClick(props.label);
  };
  return (
    <LI className={props.className} onClick={handleTabClick}>
      {props.children}
    </LI>
  );
};

export default styled(TabLabel)`
  background-color: ${props =>
    props.isActive ? props.theme.palette.background.paper : '#e1e1de'}
  border-top-left-radius: ${props => props.theme.shape.borderRadius}
  border-top-right-radius: ${props => props.theme.shape.borderRadius}
  box-shadow: ${props => (props.isActive ? '4px -4px 5px 0 #ccc' : '')}
  z-index: ${props => (props.isActive ? 301 : -300)}
`;
