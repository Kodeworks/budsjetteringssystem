import {storiesOf} from '@storybook/react';
import moment from 'moment';
import React from 'react';
import GlobalWrapper from '../helpers/GlobalWrapper';

import BalancesCalendarEntry from '../components/atoms/BalancesCalendarEntry';
import BalancesCalendar from '../components/molecules/BalancesCalendar';
import { IBalanceEntry } from '../declarations/balanceEntries';

const entry: IBalanceEntry = {
  date: '2019-06-05',
  expense: 200000,
  income: 200000,
  liquidity: 18000000,
};

const entries: Array<IBalanceEntry> = [
  {
    date: '2019-06-01',
    expense: 200000,
    income: 200000,
    liquidity: 18000000,
  },
  {
    date: '2019-06-05',
    expense: 200000,
    income: 200000,
    liquidity: 18000000,
  },
  {
    date: '2019-06-06',
    expense: 200000,
    income: 200000,
    liquidity: 18000000,
  },
  {
    date: '2019-06-08',
    expense: 200000,
    income: 200000,
    liquidity: 18000000,
  },
  {
    date: '2019-06-09',
    expense: 200000,
    income: 200000,
    liquidity: 18000000,
  },
  {
    date: '2019-06-10',
    expense: 200000,
    income: 200000,
    liquidity: 18000000,
  },
  {
    date: '2019-06-11',
    expense: 200000,
    income: 200000,
    liquidity: 18000000,
  },
  {
    date: '2019-06-12',
    expense: 200000,
    income: 200000,
    liquidity: 18000000,
  },
  {
    date: '2019-06-13',
    expense: 200000,
    income: 200000,
    liquidity: 18000000,
  },
];

const month = moment('2019-06-01');

const divStyle = {
  width: '150px',
};

storiesOf('CalendarEntry', module)
  .add('CalendarEntry', () => (
    <GlobalWrapper>
      <div style={divStyle}>
        <BalancesCalendarEntry className={'test'} entry={entry} date={'2019-06-05'} />
      </div>
    </GlobalWrapper>
  ));

storiesOf('Calendar', module)
    .add('BalancesCalendar', () => (
      <GlobalWrapper>
        <BalancesCalendar month={month} entries={entries}/>
      </GlobalWrapper>
    ));
