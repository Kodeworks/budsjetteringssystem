import React from 'react';
import styled from 'styled-components';

import explodeRecurring from '../../helpers/explode_recurring';
import { useTransactionState } from '../../store/contexts/transactions';
import AddTransaction from '../molecules/AddTransaction';
import ExpenseTransactions from '../molecules/ExpenseTransactions';
import Filters from '../molecules/Filters';
import IncomeTransactions from '../molecules/IncomeTransactions';

type ITransaction = import('../../declarations/transaction').ITransaction;

const Content = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 3em 4em;
  width: calc(100% - 4em);
  margin-top: 2em;
`;

const Transactions: React.FC = () => {
  const store = useTransactionState();

  const [filter, setFilter] = React.useState<(t: ITransaction) => boolean>(
    () => (t: ITransaction) => true
  );

  const recurringTransactions = React.useMemo(() => explodeRecurring(store), [
    store,
  ]);

  const txs = React.useMemo(
    () => store.transactions.concat(recurringTransactions).filter(filter),
    [filter, recurringTransactions, store.transactions]
  );

  return (
    <div>
      <h1>Transactions</h1>
      <h5>Showing all transactions</h5>
      <Content>
        <AddTransaction />
        <Filters setFilter={setFilter} />

        <IncomeTransactions tx={txs} />
        <ExpenseTransactions tx={txs} />
      </Content>
    </div>
  );
};

export default Transactions;
