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
  const [liquidityOneMonthAgo, setLiquidityOneMonthAgo] = React.useState<
    number
  >();

  React.useEffect(() => {
    (async () => {
      setLiquidity(
        (await API.getBalanceForDay(id, moment().format('YYYY-MM-DD'))).money /
          100
      );

      setLiquidityOneMonthAgo(
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
        <p>Change last month</p>
        <h2>
          {liquidity !== undefined && liquidityOneMonthAgo !== undefined
            ? liquidity - liquidityOneMonthAgo > 0
              ? `+${liquidity - liquidityOneMonthAgo}`
              : liquidity - liquidityOneMonthAgo
            : 'Loading...'}
        </h2>
        {liquidity !== 0 &&
          liquidity !== undefined &&
          liquidityOneMonthAgo !== 0 &&
          liquidityOneMonthAgo !== undefined && (
            <small>
              (
              {liquidity / liquidityOneMonthAgo > 0
                ? `+${(liquidity / liquidityOneMonthAgo).toFixed(0)}`
                : (liquidity / liquidityOneMonthAgo).toFixed(0)}
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
    margin-bottom: 0.5em;
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
