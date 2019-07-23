import React from 'react';
import styled from 'styled-components';

import TabMenu from '../molecules/TabMenu';

interface IProps {
  className?: string;
  children: Array<any>;
}

interface IPropsTabContent {
  className?: string;
  id: string;
  labelledBy: string;
  role: string;
  label: string;
  activeTab: string;
}

const TabContent: React.FC<IPropsTabContent> = props => {
  return <div className={props.className} id={props.id} role={props.role} aria-labelledby={props.labelledBy}>{props.children}</div>;
};

const TabsContainer: React.FC<IProps> = props => {
  const [activeTab, setActiveTab] = React.useState(
    props.children[0].props.label
  );

  const tabLabels = new Array(props.children.length);
  props.children!.forEach(child => {
    tabLabels.push(child.props.label);
  });

  return (
    <div className={props.className} >
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
            className="tab-content"
            id={`${child.props.label}-tab`}
            labelledBy={child.props.label}
            key={child.props.label}
            role="tabpanel"
            label={child.props.label}
            activeTab={activeTab}
          >
            {child.props.children}
          </TabContent>
        ))}
    </div>
  );
};

export default styled(TabsContainer)`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 2em auto;
  height: 630px;
  background-color: ${props => props.theme.palette.background.paper};

  .tab-menu {
    grid-row: 1;
  }
  .tab-content {
    grid-row: 2;
    border-radius: ${props => props.theme.shape.borderRadius};
    box-shadow: ${props => props.theme.shadow};
    padding: 1.2em 0.8em;
    z-index: 300;
  }
`;
