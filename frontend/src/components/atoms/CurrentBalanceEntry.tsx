import React from 'react';

import styled from 'styled-components';

import moment from 'moment';
import * as API from '../../mitochondria';

interface ICurrentBalanceEntryProps {
  id: number;
  name: string;
  className?: string;
}

const CurrentBalanceEntry: React.FC<ICurrentBalanceEntryProps> = ({
  className,
  id,
  name,
}) => {
  const [liquidity, setLiquidity] = React.useState<number>();
  const [liquidity30DaysAgo, setLiquidity30DaysAgo] = React.useState<number>();

  React.useEffect(() => {
    (async () => {
      setLiquidity(
        (await API.getBalanceForDay(id, moment().format('YYYY-MM-DD'))).money /
          100
      );

      setLiquidity30DaysAgo(
        (await API.getBalanceForDay(
          id,
          moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DD')
        )).money / 100
      );
    })();
  }, [id]);

  return (
    <div className={className}>
      <div>
        <h3>{name}</h3>
        <h2>{liquidity === undefined ? 'Loading...' : liquidity}</h2>
      </div>
      <div>
        <p>Change last 30 days</p>
        <h2>
          {liquidity !== undefined && liquidity30DaysAgo !== undefined
            ? liquidity - liquidity30DaysAgo > 0
              ? `+${liquidity - liquidity30DaysAgo}`
              : liquidity - liquidity30DaysAgo
            : 'Loading...'}
        </h2>
        {liquidity !== 0 &&
          liquidity !== undefined &&
          liquidity30DaysAgo !== 0 &&
          liquidity30DaysAgo !== undefined && (
            <small>
              (
              {liquidity / liquidity30DaysAgo > 0
                ? `+${(liquidity / liquidity30DaysAgo).toFixed(0)}`
                : (liquidity / liquidity30DaysAgo).toFixed(0)}
              %)
            </small>
          )}
      </div>
    </div>
  );
};

export default styled(CurrentBalanceEntry)`
  h4,
  h2,
  p {
    margin-bottom: 0 !important;
  }

  small {
    vertical-align: middle;
    font-size: 1em;
  }

  &:not(:last-child) {
    margin-bottom: 1em;
  }

  display: flex;
  justify-content: space-between;

  & > * {
    align-self: center;
  }

  h3 {
    font-weight: normal;
  }
`;
