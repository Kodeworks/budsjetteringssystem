import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import {TransactionCtx} from '../../contexts/transaction';
import {IBalanceEntry} from '../../declarations/balanceEntries';
import { IMonth } from '../../declarations/month';
import { ITransaction, TransactionType } from '../../declarations/transaction';
import MonthPicker from '../atoms/MonthPicker';
import BalancesTable from '../molecules/BalancesTable';

interface IProps {
  className?: string;
}

const Balances: React.FC<IProps> = props => {

  const { store } = React.useContext(TransactionCtx);
  const [monthChosen, setMonthChosen] = React.useState(moment());
  const [balances, setBalances] = React.useState();
  const [entries, setEntries] = React.useState();

  const createEntries = (month: IMonth) => {
    const thisMonth = new Date(month.year, month.month, 1);
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

    /* Create BalanceEntries */
    const balanceEntries: Array<IBalanceEntry> = new Array();
    Object.keys(monthBalances).forEach(be => {
      balanceEntries.push({
        date: be,
        expense: monthBalances[be].expense,
        income: monthBalances[be].income,
        liquidity: monthBalances[be].liquidity});
    });
    setEntries(balanceEntries);
  };

  const filterDate = (transaction: ITransaction) => {
    const transDate = moment(transaction.date);
    return transDate.month() === monthChosen.month() && transDate.year() === monthChosen.year() ;
  };

  async function fetchData() {
    const result = await fetch(
      `http://localhost:8000/month/month=${monthChosen.month() + 1}&year=2019&company_id=1`,
    );
    result
      .json()
      .then((res: Array<IMonth>) => {console.log(res); setBalances(res[0]); createEntries(res[0]); })
      .then(() => console.log(balances))
      .catch(err => console.log(err));
  }

  // Calculate new balance entries and update entries state when month changes.
  React.useEffect(() => {
    fetchData();
    }, []);

  return (
    <div className={props.className}>
      <div>
        <div className={'title'}>
          <h1>Balances</h1>
          <h5>Showing income, expense and liquidity for a month</h5>
        </div>
        <MonthPicker month={monthChosen} setState={setMonthChosen} />
        {entries ? 
          <BalancesTable entries={entries} /> :
          <div></div>
        }
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
