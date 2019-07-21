import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

import { IBalanceEntry } from '../../declarations/balanceEntries';
import { IMonth } from '../../declarations/month';
import * as BalancesAPI from '../../mitochondria/balances';
import BalancesViewPicker from '../atoms/BalancesViewPicker';
import MonthPicker from '../atoms/MonthPicker';
import PageTitle from '../atoms/PageTitle';
import BalancesCalendar from '../molecules/BalancesCalendar';
import BalancesTable from '../molecules/BalancesTable';

interface IProps {
  className?: string;
}

const companyId = 1; // Hardcoded until we get a global company context.

const createBalanceEntriesFromMonth = (month: IMonth) => {
  const monthBalances: {
    [s: string]: {
      income: number;
      expense: number;
      liquidity: number;
    };
  } = {};
  const sortedBalances = month.balance.sort((a, b) =>
    a.date <= b.date ? -1 : 1
  );

  const firstOfMonth = moment({
    day: 1,
    month: month.month - 1,
    year: month.year,
  });
  monthBalances[firstOfMonth.format('YYYY-MM-DD')] = {
    expense: 0,
    income: 0,
    liquidity: month.start_balance,
  };

  sortedBalances.forEach(b => {
    monthBalances[b.date] = {
      expense: 0,
      income: 0,
      liquidity: b.money,
    };
  });

  month.transactions.forEach(t => {
    const type = { IN: 'income' as const, EX: 'expense' as const }[t.type];
    monthBalances[t.date][type] += t.money;
  });

  const balanceEntries: Array<IBalanceEntry> = [];
  Object.keys(monthBalances).forEach(be => {
    balanceEntries.push({
      date: be,
      expense: monthBalances[be].expense,
      income: monthBalances[be].income,
      liquidity: monthBalances[be].liquidity,
    });
  });
  return balanceEntries;
};

const Balances: React.FC<IProps> = props => {
  const [monthChosen, setMonthChosen] = React.useState<moment.Moment>(
    moment().startOf('month')
  );
  const [entries, setEntries] = React.useState<{
    [s: string]: Array<IBalanceEntry>;
  }>({});
  const [showCalendar, setShowCalendar] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const entryKey = monthChosen.format('YYYY-MM');

      if (!(entryKey in entries)) {
        // API is indexing months starting from 1, therefore we need to add 1 to get correct result.
        const balanceEntries = await BalancesAPI.getMonth(
          monthChosen.month() + 1,
          monthChosen.year(),
          companyId
        );

        const newEntries = { ...entries };
        if (balanceEntries.length !== 1) {
          newEntries[entryKey] = [];
        } else {
          newEntries[entryKey] = createBalanceEntriesFromMonth(
            balanceEntries[0]
          );
        }
        setEntries(newEntries);
      }
    })();
  }, [monthChosen, entries]);

  const entriesIndex = monthChosen.format('YYYY-MM');
  const title = 'Balances';
  const description = 'Showing income, expense and liquidity for a month';

  return (
    <div className={props.className}>
      <div>
        <PageTitle title={title} description={description} />
        <div id={'pickers'}>
          <MonthPicker month={monthChosen} setState={setMonthChosen} />
          <BalancesViewPicker
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
          />
        </div>
        {showCalendar ? (
          <BalancesCalendar
            month={monthChosen.clone()}
            entries={entries[entriesIndex] || []}
          />
        ) : (
          <BalancesTable entries={entries[entriesIndex] || []} />
        )}
      </div>
    </div>
  );
};

export default styled(Balances)`
  margin: 2em;

  display: grid;
  grid-template-columns: calc(100% - 2em);
  grid-gap: 4em;

  #pickers {
    display: flex;
  }
`;
