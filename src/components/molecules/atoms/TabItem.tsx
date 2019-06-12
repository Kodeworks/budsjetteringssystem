import React from 'react';
import styled from 'styled-components';

interface IProps {
  isActive: boolean;
  className?: string;
  tabIndex: number;
  onClick: (index: number) => void;
}

const TabItem: React.FC<IProps> = (props) => {
  const {className} = props;

  const handleClick = () => props.onClick(props.tabIndex);
  return (
    <li onClick={handleClick} className={className}>{props.children}</li>
  );
};

export default styled(TabItem)`
  display: inline-block;
  list-style: none;
  margin-bottom: -1px;
  padding: 0.5rem 0.75rem;
  ${props => props.isActive ? `border: solid #ccc;
  background-color: white;
  border-width: 1px 1px 0 1px;` : undefined };
`;
