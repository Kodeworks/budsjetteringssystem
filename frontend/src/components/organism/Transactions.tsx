import React from 'react';
import styled from 'styled-components';

import moment from 'moment';
import { flatMap } from '../../helpers/flatMap';
import { useTransactionState } from '../../store/contexts/transactions';
import AddTransaction from '../molecules/AddTransaction';
import ExpenseTransactions from '../molecules/ExpenseTransactions';
import Filters from '../molecules/Filters';
import IncomeTransactions from '../molecules/IncomeTransactions';

type ITransaction = import('../../declarations/transaction').ITransaction;
type IRecurringTransaction = import('../../declarations/transaction').IRecurringTransaction;

const Content = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 3em 4em;
  width: calc(100% - 4em);
  margin-top: 2em;
`;

const intervalTypeConverter = (t: IRecurringTransaction['interval_type']) =>
  ({ DA: 'd' as const, MO: 'M' as const }[t]);

const Transactions: React.FC = () => {
  const store = useTransactionState();

  const [filter, setFilter] = React.useState<(t: ITransaction) => boolean>(
    () => (t: ITransaction) => true
  );

  const recurringTransactions = React.useMemo(
    () =>
      flatMap(store.recurring, e => {
        const dates: Array<string> = [];

        for (
          const d = moment(e.start_date);
          d.isSameOrBefore(moment(e.end_date));
          d.add(e.interval, intervalTypeConverter(e.interval_type))
        ) {
          if (
            // Check if this date has been overwritten
            store.transactions.find(
              t =>
                moment(t.date).isSame(d) &&
                t.recurring_transaction_id === e.id &&
                t.company_id === e.company_id
            )
          ) {
            continue;
          }
          dates.push(d.format('YYYY-MM-DD'));
        }

        return dates.map(
          (date, index) =>
            ({
              company_id: e.company_id,
              date,
              description: e.template.description,
              id: `${date}-${index}}`,
              money: e.template.money,
              notes: e.template.notes,
              recurring_transaction_id: e.id,
              type: e.template.type,
            } as ITransaction & { id: string })
        );
      }),
    [store.recurring, store.transactions]
  );

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
