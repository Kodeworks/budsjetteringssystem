import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import explodeRecurring from '../../helpers/explode_recurring';
import { useAuthState } from '../../store/contexts/auth';
import { useTransactionState } from '../../store/contexts/transactions';
import PageTitle from '../atoms/PageTitle';

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

  const renderTransactions = () =>
    transactions
      .filter(t =>
        moment(t.date).isBetween(
          moment().startOf('month'),
          moment().add(5, 'years')
        )
      )
      .sort((t1, t2) => (t2.date > t1.date ? -1 : 1))
      .map(t => {
        accumulatedBalance += (t.type === 'IN' ? t.money : -t.money) / 100;
        return (
          <tr key={`id${t.id}`}>
            <td>{moment(t.date, moment.ISO_8601).format('DD/MM/YYYY')}</td>
            <td>{t.description}</td>
            <td>{t.type === 'IN' ? (t.money / 100).toFixed(2) : ''}</td>
            <td>{t.type === 'EX' ? (t.money / 100).toFixed(2) : ''}</td>
            <td>{accumulatedBalance.toFixed(2)}</td>
          </tr>
        );
      });

  return (
    <>
      <PageTitle
        title="Projections"
        description="View the projected liquidity of your company."
      />

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
        <tbody>{renderTransactions()}</tbody>
      </table>
    </>
  );
};

export default styled(Projections)`
  width: 60%;
  border-collapse: collapse;

  td,
  th {
    padding: 8px;
    border: 1px solid black;
  }
`;
