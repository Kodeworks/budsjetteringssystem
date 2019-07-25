import React from 'react';
import styled from 'styled-components';

import PageTitle from '../atoms/PageTitle';
import Tab from '../molecules/Tab';
import TabsContainer from '../molecules/TabsContainer';

interface IProps {
  className?: string;
}

const UnstyledDashboard: React.FC<IProps> = props => {
  return (
    <div className={props.className}>
      <div className="page-title">
        <PageTitle
          title="Dashboard"
          description="Showing key performance indicators for current company"
        />
      </div>
      <TabsContainer className="tabs-container">
        <Tab label="Minimum Liquidity">
          <h3>Projected minimum liquidity</h3>
        </Tab>
        <Tab label="Transaction Volumes">
          <h3>Transaction volumes</h3>
        </Tab>
        <Tab label="Balances">
          <h3>Monthly balances</h3>
        </Tab>
      </TabsContainer>
    </div>
  );
};

const Dashboard = styled(UnstyledDashboard)`
  display: grid;
  grid-template-columns: repeat(12, calc(100% / 12));
  grid-template-rows: 25% auto;

  .page-title {
    grid-column: 1 / span 12;
  }

  .tabs-container {
    grid-column: 1 / span 12;
  }
`;

export default Dashboard;
