import React from 'react';

import PageTitle from '../atoms/PageTitle';
import CurrentBalance from '../molecules/CurrentBalance';

const Dashboard: React.FC = props => {
  return (
    <>
      <PageTitle
        title="Dashboard"
        description="Showing key performance indicators for current company"
      />

      <CurrentBalance />
    </>
  );
};

export default Dashboard;
