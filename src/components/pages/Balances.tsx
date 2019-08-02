import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

import * as BalancesAPI from '../../mitochondria/balances';
import { useAuthState } from '../../store/contexts/auth';
import BalancesViewPicker from '../atoms/BalancesViewPicker';
import MonthPicker from '../atoms/MonthPicker';
import PageTitle from '../atoms/PageTitle';
import BalancesCalendar from '../molecules/BalancesCalendar';
import BalancesTable from '../molecules/BalancesTable';

type IBalanceEntry = import('../../declarations/balanceEntries').IBalanceEntry;

const createBalanceEntriesFromMonth = (
  month: import('../../declarations/month').IMonth
) => {
  const monthBalances: {
    [s: string]: {
      income: number;
      expense: number;
      liquidity: number;
    };
  } = {};
  const sortedBalances = month.balances.sort((a, b) =>
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

const Balances: React.FC<{ className?: string }> = props => {
  const [monthChosen, setMonthChosen] = React.useState<moment.Moment>(
    moment().startOf('month')
  );
  const [entries, setEntries] = React.useState<{
    [s: string]: Array<IBalanceEntry>;
  }>({});
  const [showCalendar, setShowCalendar] = React.useState(true);

  // Current company is hardcoded to be the first company in the companyState array.
  // This will be changed to use the state for "current company selected" when that gets implemented.
  const auth = useAuthState();

  /**
   * We want to clear the entries if the auth changes.
   * Thankfully, react hooks are called sequentially, so we know this will run before the
   * part which sets fetches the results, and uses the setEntries function to update
   * the view.
   */
  React.useEffect(() => {
    setEntries({});
  }, [auth]);

  React.useEffect(() => {
    (async () => {
      const entryKey = monthChosen.format('YYYY-MM');

      if (!(entryKey in entries)) {
        // API is indexing months starting from 1, therefore we need to add 1 to get correct result.
        const newEntries = { ...entries };
        try {
          const month = await BalancesAPI.getMonth(
            monthChosen.month() + 1,
            monthChosen.year(),
            auth!.selectedCompany!
          );
          newEntries[entryKey] = createBalanceEntriesFromMonth(month);
          setEntries(newEntries);
        } catch (e) {
          alert(`Error encountered: ${e.message}.`);
          newEntries[entryKey] = [];
          setEntries(newEntries);
        }
      }
    })();
  }, [monthChosen, entries, auth]);

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
