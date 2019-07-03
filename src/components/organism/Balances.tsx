import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { IBalanceEntry } from '../../declarations/balanceEntries';
import { IMonth } from '../../declarations/month';
import { TransactionType } from '../../declarations/transaction';
import BalancesAPI from '../../mitochondria/balances';
import MonthPicker from '../atoms/MonthPicker';
import PageTitle from '../atoms/PageTitle';
import BalancesTable from '../molecules/BalancesTable';

interface IProps {
  className?: string;
}

interface IError {
  detail: string;
}

const companyId = 1; // Hardcoded until we get a global company context.

const Balances: React.FC<IProps> = props => {

  const [monthChosen, setMonthChosen] = React.useState<moment.Moment>(moment());
  const [entries, setEntries] = React.useState<{[s: string]: Array<IBalanceEntry>}>({});

  const createEntries = (month: IMonth) => {

    const monthBalances: { [s: string]: {income: number, expense: number, liquidity: number}; } = {};
    const sortedBalances = month.balance.sort((a, b) => {
      if (a.date <= b.date ) {
        return -1;
      }
      return 1;
    });

    const firstOfMonth = moment({year: month.year, month: month.month, day: 1});
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
      // TransactionType with capital first letter does not reflect enums from API with lowercase..
      if (t.type.charAt(0).toUpperCase() + t.type.slice(1) === TransactionType.income) {
        monthBalances[t.date].income += t.money;
      } else {
        monthBalances[t.date].expense += t.money;
      }
    });

    const balanceEntries: Array<IBalanceEntry> = [];
    Object.keys(monthBalances).forEach(be => {
      balanceEntries.push({
        date: be,
        expense: monthBalances[be].expense,
        income: monthBalances[be].income,
        liquidity: monthBalances[be].liquidity});
    });
    return balanceEntries;
  };

  React.useEffect(() => {

    // Fetch month and create balance entries for chosen month if not done already.
    if (!(`${monthChosen.month()}-${monthChosen.year()}` in entries)) {
      BalancesAPI.getMonth(monthChosen.month() + 1, monthChosen.year(), companyId)
        .then(balanceEntries => {
          if (balanceEntries.length !== 1) {
            const newEntries = {...entries};
            newEntries[`${monthChosen.month()}-${monthChosen.year()}`] = [];
            setEntries(newEntries);
          } else {
            const newEntries = {...entries};
            newEntries[`${monthChosen.month()}-${monthChosen.year()}`] = createEntries(balanceEntries[0]);
            setEntries(newEntries);
          }
        })
        .catch(error => {
          alert(error);
        });
    }
  }, [monthChosen, entries]);

  const entriesIndex = `${monthChosen.month()}-${monthChosen.year()}`;
  const title = 'Balances';
  const description = 'Showing income, expense and liquidity for a month';

  return (
    <div className={props.className}>
      <div>
        <PageTitle title={title} description={description} />
        <MonthPicker month={monthChosen} setState={setMonthChosen} />
        <BalancesTable entries={entries[entriesIndex] ? entries[entriesIndex] : []} />
      </div>
    </div>
  );
};

export default styled(Balances)`
  margin: 2em;

  display: grid;
  grid-template-columns: calc(70% - 2em) ;
  grid-gap: 4em;
`;

/*

*/
