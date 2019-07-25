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
  padding-left: 0;
  height: 100%;
  padding: 0px 5px;
  list-style-type: none;
  background-color: ${props => props.theme.palette.background.default};
`;

const TabMenu: React.FC<ITabMenuProps> = props => {
  const handleTabClick = (label: string) => {
    props.setActiveTab(label);
  };

  const renderTabs = () =>
    props.tabLabels.map((label, i) => (
      <TabLabel
        key={label}
        label={label}
        onClick={handleTabClick}
        isActive={label === props.activeTab}
      >
        {label}
      </TabLabel>
    ));
  return (
    <UL role="tablist" aria-label="Dashboard graphs" data-testid="Tab-menu">
      {renderTabs()}
    </UL>
  );
};

export default TabMenu;
