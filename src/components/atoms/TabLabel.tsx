import React from 'react';
import styled from 'styled-components';

interface IProps {
  isActive: boolean;
  className?: string;
  tabIndex: number;
  onClick: () => void;
}

const LI = styled.li`
  display: inline-block;
  list-style: none;
  margin-bottom: -1px;
  padding: 0.5rem 0.75rem;
`;

const TabLabel: React.FC<IProps> = props => {
  return <LI onClick={props.onClick}>{props.children}</LI>;
};

export default styled(TabLabel)`
  
  background-color: ${props => 
    props.isActive ? props.theme.palette.background.paper : props.theme.palette.background.default }
  
  border-width: 1px 1px 0 1px;
`;
