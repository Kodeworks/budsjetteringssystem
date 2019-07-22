import React, { ReactElement } from 'react';
import styled from 'styled-components';

import Tab, { IPropsTab } from '../molecules/Tab';

interface IChildProps extends HTMLDivElement {
  label: string;
  children: any;
}

interface IProps {
  className?: string;
  children: Array<IChildProps>;
}

const UnstyledTabsContainer: React.FC<IProps> = props => {
  const [activeTab, setActiveTab] = React.useState();

  const onClickTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="tabs-container">
      <ul className="tab-list">
        {props.children.map(child => {
          const { label } = child;

          return (
            <Tab
              activeTab={activeTab}
              key={label}
              label={label}
              onClickTab={onClickTab}
              children={child.children}
            />
          );
        })}
      </ul>
      <div className="tab-content">
        {props.children.map(child => {
          if (child.label !== activeTab) {
            return undefined;
          }
          return child.children;
        })}
      </div>
    </div>
  );
};

const DashBoardTabs = styled(UnstyledTabsContainer)`
  display: grid;
`;

export default DashBoardTabs;
