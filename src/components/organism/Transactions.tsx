import React from 'react';
import styled from 'styled-components';

import { ITransaction, TransactionType } from '../../declarations/transaction';

import AddTransaction from '../molecules/AddTransaction';
import ExpenseTransactions from '../molecules/ExpenseTransactions';
import Filters from '../molecules/Filters';
import IncomeTransactions from '../molecules/IncomeTransactions';

interface IProps {
  className?: string;
}

const Content = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 3em 4em;
  width: calc(100% - 4em);
  margin-top: 2em;
`;
const txEntries: Array<ITransaction> = [
  { id: 0, name: 'Cute otter pictures', money: 25089, type: TransactionType.expense, date: '23. august', companyId: 0 },
  {
    companyId: 0, notes: 'Welcome to the jungle compadre.',
    date: '23. august',
    id: 1,
    money: 120308,
    name: 'Weird gerbils',
    type: TransactionType.expense,
  },
  { id: 2, name: 'Cats with hats', money: 6516813, type: TransactionType.expense, date: '23. august', companyId: 0 },
  { id: 3, name: 'Constructive', money: 2105089, type: TransactionType.income, date: '26. august', companyId: 0 },
  { id: 4, name: 'Cute hats', money: 616823, type: TransactionType.expense, date: '23. august', companyId: 0 },
];

const Transactions: React.FC<IProps> = ({ className }) => (
  <div className={className}>
    <h1>Transactions</h1>
    <h5>Showing all transactions</h5>

    <Content>
      <AddTransaction />
      <Filters />

      <div>
        <IncomeTransactions tx={txEntries} />
      </div>

      <div>
        <ExpenseTransactions tx={txEntries} />
      </div>
    </Content>
  </div>
);

export default styled(Transactions)`
  h1 {
    font-weight: 700;
    font-size: 1.8em;
  }

  h5 {
    font-weight: 300;
    line-height: .7em;
  }
`;
