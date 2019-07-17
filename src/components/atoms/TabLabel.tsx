import React from 'react';
import styled from 'styled-components';

interface IProps {
  isActive: boolean;
  className?: string;
  tabIndex: number;
  onClick: (index: number) => void;
}

const LI = styled.li`
  display: inline-block;
  list-style: none;
  margin-bottom: -1px;
  padding: 0.5rem 0.75rem;
`;

const TabLabel: React.FC<IProps> = props => {
  const handleClick = () => props.onClick(props.tabIndex);
  return <LI onClick={handleClick}>{props.children}</LI>;
};

export default styled(TabLabel)`
  ${props =>
    props.isActive &&
    `border: solid #ccc;
  background-color: white;
  border-width: 1px 1px 0 1px;`};
`;
