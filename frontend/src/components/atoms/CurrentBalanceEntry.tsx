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
      try {
        setLiquidity(
          (await API.getBalanceForDay(id, moment().format('YYYY-MM-DD')))
            .money / 100
        );

        setLiquidityOneMonthAgo(
          (await API.getBalanceForDay(
            id,
            moment()
              .subtract(1, 'month')
              .format('YYYY-MM-DD')
          )).money / 100
        );
      } catch (e) {
        setLiquidity(0);
        setLiquidityOneMonthAgo(0);
      }
    })();
  }, [id]);

  const diff =
    liquidity !== undefined && liquidityOneMonthAgo !== undefined
      ? liquidity - liquidityOneMonthAgo
      : undefined;

  return (
    <div className={className}>
      <div>
        <h3>{name}</h3>
        <h2>{liquidity === undefined ? 'Loading...' : liquidity}</h2>
      </div>
      <div>
        <p>Change last month</p>
        <h2>
          {diff !== undefined ? (diff > 0 ? `+${diff}` : diff) : 'Loading...'}
        </h2>
        {diff !== 0 &&
          diff !== undefined &&
          liquidityOneMonthAgo !== 0 &&
          liquidityOneMonthAgo !== undefined && (
            <small>
              (
              {diff / liquidityOneMonthAgo > 0
                ? `+${((diff / liquidityOneMonthAgo) * 100).toFixed(0)}`
                : ((diff / liquidityOneMonthAgo) * 100).toFixed(0)}
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
