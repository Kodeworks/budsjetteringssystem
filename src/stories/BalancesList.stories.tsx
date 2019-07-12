import {storiesOf} from '@storybook/react';
import React from 'react';
import GlobalWrapper from '../helpers/GlobalWrapper';

import BalancesViewPicker from '../components/atoms/BalancesViewPicker';
import BalancesTable from '../components/molecules/BalancesTable';
import Balances from '../components/organism/Balances';
import { IBalanceEntry } from '../declarations/balanceEntries';

const entries: Array<IBalanceEntry> = [
  {date: '2019-06-01', income: 340000, expense: 100000, liquidity: 8430000},
  {date: '2019-06-22', income: 100000, expense: 300000, liquidity: 8670000},
  {date: '2019-06-25', income: 200050, liquidity: 8870000},
];

const WrappedBalancesViewPicker = (props: any) => {
  const [showCalendar, setShowCalendar] = React.useState(true);
  return (
    <BalancesViewPicker showCalendar={showCalendar} setShowCalendar={setShowCalendar} />
  );
};

storiesOf('Balances', module)
  .add('Balances', () => (
    <Balances />
  ))
  .add('BalancesTable', () => (
    <GlobalWrapper>
      <BalancesTable entries={entries} />
    </GlobalWrapper>
  ))
  .add('BalancesViewPicker', () => (
    <GlobalWrapper>
      <WrappedBalancesViewPicker />
    </GlobalWrapper>
  ));
