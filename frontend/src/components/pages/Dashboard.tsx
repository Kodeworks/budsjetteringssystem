import React from 'react';
import styled from 'styled-components';

import PageTitle from '../atoms/PageTitle';

const Dashboard: React.FC<{ className?: string }> = props => {
  return (
    <div className={props.className}>
      <div className="page-title">
        <PageTitle
          title="Dashboard"
          description="Showing key performance indicators for current company"
        />
      </div>
    </div>
  );
};

export default styled(Dashboard)`
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
