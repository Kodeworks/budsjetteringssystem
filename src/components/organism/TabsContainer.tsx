import React from 'react';
import styled from 'styled-components';

import TabMenu from '../molecules/TabMenu';

interface IProps {
  className?: string;
  children: Array<any>
}

interface IPropsTabContent {
  className?: string;
  label: string;
  activeTab: string;
}

const TabContent: React.FC<IPropsTabContent> = props => {
  return (
    <div className={props.className}>
      {props.children}
    </div>
  )
}

const TabsContainer: React.FC<IProps> = props => {
  const [activeTab, setActiveTab] = React.useState(props.children[0].props.label);

  const tabLabels: Array<string> = new Array(props.children.length); 
  props.children!.forEach(child => {
    tabLabels.push(child.props.label);
  });

  return (
    <div className="tabs-container">
      <TabMenu 
        className="tab-menu" 
        tabLabels={tabLabels}
        activeTab={activeTab}
        setActiveTab={setActiveTab} 
       />
       {props.children
        .filter(child => child.props.label === activeTab)
        .map(child => (
        <TabContent
          key={child.props.label} 
          label={child.props.label} 
          activeTab={activeTab}
         >
          {child.props.children}
        </TabContent>))} 
    </div>
  );
};

export default styled(TabsContainer)`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 10% 90%;
  border-radius: ${props => props.theme.shape.borderRadius};
  background-color: ${props => props.theme.palette.background.paper};
  box-shadow: ${props => props.theme.shadow};

  .tab-menu {
    grid-row: 2;
    grid-column: 1 / span 12;
  }

`;
