import React, { useState } from 'react';
import styled from 'styled-components';
import TabLabel from '../atoms/TabLabel';

interface ITabMenuProps {
  className?: string;
  tabLabels: Array<string>;
}

const UL = styled.ul`
  border-bottom: 1px solid #ccc;
  padding-left: 0;
  list-style-type: none;
`;

const TabMenu: React.FC<ITabMenuProps> = ({className, tabLabels, children}) => {
  const [activeTab, setActiveTab] =  useState(0);

  const handleTabClick = (index: number) => setActiveTab(index);

  const renderTabs = () => (
    tabLabels.map((label, i) => (
      <TabLabel key={label} tabIndex={i} onClick={handleTabClick} isActive={i === activeTab}>{label}</TabLabel>),
      )
  );
  return (
      <UL>{renderTabs()}</UL>
  );
};

export default TabMenu;
