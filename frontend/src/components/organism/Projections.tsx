import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { useTransactionState } from '../../store/contexts/transactions';

const Projections: React.FC<{ className?: string }> = ({ className }) => {
  const { transactions } = useTransactionState();
  // Note: currentBalance should be changed to be the incoming balance to the current month (first day of the month)
  const currentBalance = 0;
  let accumulatedBalance = currentBalance;
  // render transactions from first day of current month until five years in the future
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
        t.type === 'IN'
          ? (accumulatedBalance += t.money / 100)
          : (accumulatedBalance -= t.money / 100);
        return (
          <tr key={`id${t.id}`}>
            <td>{t.date}</td>
            <td>{t.description}</td>
            <td>{t.type === 'IN' ? (t.money / 100).toFixed(2) : ''}</td>
            <td>{t.type === 'EX' ? (t.money / 100).toFixed(2) : ''}</td>
            <td>{accumulatedBalance.toFixed(2)}</td>
          </tr>
        );
      });
  return (
    <table className={className}>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>In</th>
        <th>Out</th>
        <th>Available</th>
      </tr>
      {renderTransactions()}
    </table>
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
