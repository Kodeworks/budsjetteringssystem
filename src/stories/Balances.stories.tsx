import { addDecorator, storiesOf } from '@storybook/react';
import React from 'react';
import GlobalWrapper from '../helpers/GlobalWrapper';

import moment from 'moment';
import BalancesCalendarEntry from '../components/atoms/BalancesCalendarEntry';
import BalancesViewPicker from '../components/atoms/BalancesViewPicker';
import BalancesCalendar from '../components/molecules/BalancesCalendar';
import BalancesTable from '../components/molecules/BalancesTable';
import Balances from '../components/organism/Balances';
import { IBalanceEntry } from '../declarations/balanceEntries';

addDecorator(fn => <GlobalWrapper>{fn()}</GlobalWrapper>);

const entries: Array<IBalanceEntry> = new Array(13).fill(0).map((e, i) => ({
  date: `2019-06-${String(i + 1).padStart(2, '0')}`,
  expense: 200000,
  income: 200000,
  liquidity: 18000000,
}));

const entry: IBalanceEntry = {
  date: '2019-06-05',
  expense: 200000,
  income: 200000,
  liquidity: 18000000,
};

const month = moment('2019-06-01');

const divStyle = {
  width: '150px',
};

const WrappedBalancesViewPicker = (props: any) => {
  const [showCalendar, setShowCalendar] = React.useState(true);
  return (
    <BalancesViewPicker
      showCalendar={showCalendar}
      setShowCalendar={setShowCalendar}
    />
  );
};

storiesOf('Balances', module)
  .add('Balances', () => <Balances />)
  .add('BalancesTable', () => <BalancesTable entries={entries} />)
  .add('BalancesViewPicker', () => <WrappedBalancesViewPicker />)
  .add('BalancesCalendar', () => (
    <BalancesCalendar month={month} entries={entries} />
  ))
  .add('BalencesCalendarEntry', () => (
    <div style={divStyle}>
      <BalancesCalendarEntry
        className={'test'}
        entry={entry}
        date={'2019-06-05'}
      />
    </div>
  ));
