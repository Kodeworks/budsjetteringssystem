import React from 'react';
import styled from 'styled-components';
import TabLabel from '../atoms/TabLabel';

interface ITabMenuProps {
  className?: string;
  tabLabels: Array<string>;
  activeTab: string;
  setActiveTab: (label: string) => void;
}

const UL = styled.ul`
  border-bottom: 1px solid #ccc;
  padding-left: 0;
  list-style-type: none;
  background-color: ${props => props.theme.palette.background.paper};
`;

const TabMenu: React.FC<ITabMenuProps> = props => {
  
  const handleTabClick = (label: string) => {
    props.setActiveTab(label);
  };

  const renderTabs = () =>
    props.tabLabels.map((label, i) => (
      <TabLabel
        key={label}
        tabIndex={i}
        onClick={() => handleTabClick(label)}
        isActive={label === props.activeTab}
      >
        {label}
      </TabLabel>
    ));
  return <UL>{renderTabs()}</UL>;
};

export default TabMenu;
