import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import {TransactionCtx} from '../../contexts/transaction';
import {IBalanceEntry} from '../../declarations/balanceEntries';
import { ITransaction } from '../../declarations/transaction';
import MonthPicker from '../atoms/MonthPicker';
import BalancesTable from '../molecules/BalancesTable';

interface IProps {
  className?: string;
}

const Balances: React.FC<IProps> = props => {
  const devEntries: Array<IBalanceEntry> = [
    {date: '1/6', income: 340000, expense: 100000, liquidity: 8430000},
    {date: '24/6', income: 100000, expense: 300000, liquidity: 8670000},
    {date: '25/6', income: 200050, liquidity: 8870000},
  ];

  const { store } = React.useContext(TransactionCtx);
  const [month, setMonth] = React.useState(moment());
  const [entries, setEntries] = React.useState([]);

  const filterDate = (transaction: ITransaction) => {
    const transDate = moment(transaction.date);
    return transDate.month() === month.month() && transDate.year() === month.year() ;
  };

  // Calculate new balance entries and update entries state when month changes.
  React.useEffect(() => {
    const transactions = store.transactions.filter(filterDate);
    let entries = [];
    
    });

  return (
    <div className={props.className}>
      <div>
        <div className={'title'}>
          <h1>Balances</h1>
          <h5>Showing income, expense and liquidity for a month</h5>
        </div>
        <MonthPicker month={month} setState={setMonth} />
        <BalancesTable entries={entries} />
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
