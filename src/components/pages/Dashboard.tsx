import React from 'react';
import styled from 'styled-components';

import PageTitle from '../atoms/PageTitle';
import TabsContainer from '../organism/TabsContainer';

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
      <TabsContainer>
        <div label="Tab-1">This is tab 1.</div>
        <div label="Tab-2">This is tab 1.</div>
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
`;

export default Dashboard;
