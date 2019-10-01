import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import explodeRecurring from '../../helpers/explode_recurring';
import { useAuthState } from '../../store/contexts/auth';
import { useTransactionState } from '../../store/contexts/transactions';
import PageTitle from '../atoms/PageTitle';
import { ITransaction } from '../../declarations/transaction';

const Projections: React.FC<{ className?: string }> = ({ className }) => {
  const store = useTransactionState();
  const auth = useAuthState();

  const recurringTransactions = React.useMemo(() => explodeRecurring(store), [
    store,
  ]);

  const transactions = React.useMemo(
    () =>
      store.transactions
        .concat(recurringTransactions)
        .filter(e => e.company_id === auth!.selectedCompany!),
    [auth, recurringTransactions, store.transactions]
  );

  let accumulatedBalance = 0;

  const transactionsGroupedByMonth: {
    [s: string]: [ITransaction];
  } = transactions
    .filter(t =>
      moment(t.date).isBetween(
        moment().startOf('month'),
        moment().add(5, 'years')
      )
    )
    .sort((t1, t2) => (t2.date > t1.date ? -1 : 1))
    .reduce(function(
      groupedTransactions: { [s: string]: [ITransaction?] },
      currentTransaction
    ): { [s: string]: [ITransaction?] } {
      let dateKey = moment(currentTransaction.date).format('YYYY/MM');
      if (!groupedTransactions.hasOwnProperty(dateKey)) {
        groupedTransactions[dateKey] = [];
      }
      groupedTransactions[dateKey].push(currentTransaction);
      return groupedTransactions;
    },
    {});

  const renderTransactionsByMonth = () => {
    return Object.keys(transactionsGroupedByMonth).map(monthTransactions => {
      return (
        <table className={className}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>In</th>
              <th>Out</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {transactionsGroupedByMonth[monthTransactions].map(transaction => {
              accumulatedBalance +=
                (transaction.type === 'IN'
                  ? transaction.money
                  : -transaction.money) / 100;
              return (
                <tr key={`id${transaction.id}`}>
                  <td>
                    {moment(transaction.date, moment.ISO_8601).format(
                      'DD/MM/YYYY'
                    )}
                  </td>
                  <td>{transaction.description}</td>
                  <td>
                    {transaction.type === 'IN'
                      ? (transaction.money / 100).toFixed(2)
                      : ''}
                  </td>
                  <td>
                    {transaction.type === 'EX'
                      ? (transaction.money / 100).toFixed(2)
                      : ''}
                  </td>
                  <td>{accumulatedBalance.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    });
  };

  return (
    <>
      <PageTitle
        title="Projections"
        description="View the projected liquidity of your company."
      />
      {renderTransactionsByMonth()}
    </>
  );
};

export default styled(Projections)`
  width: 60%;
  border-collapse: collapse;
  margin-bottom: 30px;

  td,
  th {
    padding: 8px;
    border: 1px solid black;
  }

  tr,
  th {
    display: grid;
    grid-template-columns: 15% 25% 20% 20% 20%;
  }
`;
