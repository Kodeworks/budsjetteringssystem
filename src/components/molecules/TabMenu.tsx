import React, { useState } from 'react';
import styled from 'styled-components';
import TabItem from './atoms/TabItem';

interface ITabMenuProps {
  className?: string;
  tabLabels: Array<string>;
}

const TabMenu: React.FC<ITabMenuProps> = ({className, tabLabels, children}) => {
  const [activeTab, setActiveTab] =  useState(0);

  const handleTabClick = (index: number) => setActiveTab(index);

  const renderTabs = () => (
    tabLabels.map((e, i) => (
      <TabItem key={e} tabIndex={i} onClick={handleTabClick} isActive={i === activeTab}>{e}</TabItem>),
      )
  );
  return (
    <React.Fragment>
      <ul className={className} style={{listStyleType: 'none'}} >
        {renderTabs()}
      </ul>
    </React.Fragment>

  );
};

export default styled(TabMenu)`
  border-bottom: 1px solid #ccc;
  padding-left: 0;
`;
