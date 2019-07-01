import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import {TransactionCtx} from '../../contexts/transaction';
import {IBalanceEntry} from '../../declarations/balanceEntries';
import { IMonth } from '../../declarations/month';
import { TransactionType } from '../../declarations/transaction';
import MonthPicker from '../atoms/MonthPicker';
import BalancesTable from '../molecules/BalancesTable';

interface IProps {
  className?: string;
}

interface IError {
  detail: string;
}

const BASE_URL = 'http://localhost:8000/' as const;

const Balances: React.FC<IProps> = props => {

  const { store } = React.useContext(TransactionCtx);
  const [monthChosen, setMonthChosen] = React.useState<moment.Moment>(moment());
  const [entries, setEntries] = React.useState<{[s: string]: Array<IBalanceEntry>}>({});

  const createEntries = (month: IMonth) => {

    const monthBalances: { [s: string]: {income: number, expense: number, liquidity: number}; } = {};
    const liquidities = month.balance.sort((a, b) => {
      if (a.date <= b.date ) {
        return -1;
      }
      return 1;
    });
    monthBalances[`${month.year}-${month.month < 9 ? '0' : ''}${month.month}-01`] = {
      expense: 0,
      income: 0,
      liquidity: month.start_balance,
    };

    liquidities.forEach(b => {
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

    const balanceEntries: Array<IBalanceEntry> = new Array();
    Object.keys(monthBalances).forEach(be => {
      balanceEntries.push({
        date: be,
        expense: monthBalances[be].expense,
        income: monthBalances[be].income,
        liquidity: monthBalances[be].liquidity});
    });
    return balanceEntries;
  };

  async function fetchMonthByMonthYearAndCompanyId() {
    const url = `${BASE_URL}month?month=${monthChosen.month() + 1}&year=${monthChosen.year()}&company_id=1`;
    const result = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    );

    if (result.status === 200) {
      const parsedResult = await result.json() as Array<IMonth>;

      return parsedResult;
    } else if (result.status === 400) {
      throw new Error((await result.json() as IError).detail);
    }

    throw new Error('Unexpected response from server.');
  }

  // Calculate new balance entries and update entries state when month changes.
  React.useEffect(() => {
    // If month has been fetched and already exists in store, do nothing.
    if (`${monthChosen.month()}-${monthChosen.year()}` in entries) {
      return;
    }

    // Else, fetch from API
    fetchMonthByMonthYearAndCompanyId()
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
    }, [monthChosen]);

  const key = `${monthChosen.month()}-${monthChosen.year()}`;

  return (
    <div className={props.className}>
      <div>
        <div className={'title'}>
          <h1>Balances</h1>
          <h5>Showing income, expense and liquidity for a month</h5>
        </div>
        <MonthPicker month={monthChosen} setState={setMonthChosen} />
        <BalancesTable entries={entries[key] ? entries[key] : []} />
      </div>
    </div>
  );
};

export default styled(Balances)`
  margin: 2em;

  h1 {
    font-weight: 700;
    font-size: 1.8em;
  }

  h5 {
    font-weight: 300;
    line-height: .7em;
  }

  .title {
    margin-bottom: 4em;
  }

  display: grid;
  grid-template-columns: calc(70% - 2em) ;
  grid-gap: 4em;
`;
