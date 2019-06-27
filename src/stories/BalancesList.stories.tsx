import {storiesOf} from '@storybook/react';
import React from 'react';
import GlobalWrapper from '../helpers/GlobalWrapper';

import BalancesTable from '../components/molecules/BalancesTable';
import Balances from '../components/organism/Balances';
import { IBalanceEntry } from '../declarations/balanceEntries';

const entries: Array<IBalanceEntry> = [
  {date: '1/6', income: 340000, expense: 100000, liquidity: 8430000},
  {date: '24/6', income: 100000, expense: 300000, liquidity: 8670000},
  {date: '25/6', income: 200050, liquidity: 8870000},
];

storiesOf('Balances', module)
  .add('Balances', () => (
    <Balances />
  ))
  .add('BalancesTable', () => (
    <GlobalWrapper>
      <BalancesTable entries={entries} />
    </GlobalWrapper>
  ));
