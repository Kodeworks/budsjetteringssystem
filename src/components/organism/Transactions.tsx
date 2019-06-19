import React from 'react';
import styled from 'styled-components';

import { TransactionCtx } from '../../contexts/transaction';

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

const Transactions: React.FC<IProps> = ({ className }) => {
  const { store } = React.useContext(TransactionCtx);

  return (
    <div className={className}>
      <h1>Transactions</h1>
      <h5>Showing all transactions</h5>

      <Content>
        <AddTransaction />
        <Filters />

        <div>
          <IncomeTransactions tx={store.transactions} fetchMore={alert}/>
        </div>

        <div>
          <ExpenseTransactions tx={store.transactions} fetchMore={alert}/>
        </div>
      </Content>
    </div>
  );
};

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
