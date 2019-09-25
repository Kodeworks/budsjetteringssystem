import React from 'react';

import styled from 'styled-components';
import PageTitle from '../atoms/PageTitle';
import Chart from '../molecules/Chart';
import CurrentBalance from '../molecules/CurrentBalance';

const Divider = styled.hr`
  margin-top: 2em;
`;

const Dashboard: React.FC = props => {
  return (
    <>
      <PageTitle
        title="Dashboard"
        description="Showing key performance indicators for current company"
      />

      <CurrentBalance />
      <Divider />
      <Chart />
    </>
  );
};

export default Dashboard;
