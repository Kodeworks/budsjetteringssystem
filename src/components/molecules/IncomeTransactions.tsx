import React from 'react';

import OutlinedButton from '../atoms/OutlinedButton';
import TransactionEntry from '../atoms/TransactionEntry';

import styled from 'styled-components';

import { ITransaction } from '../../declarations/transaction';

interface IProps {
  tx: Array<ITransaction>;
  className?: string;
  fetchMore: () => void;
}

const txEntry = (t: ITransaction) => (
  <TransactionEntry hideIncomeExpenseBadge={true} key={t.id} {...t} />
);

const IncomeTransactions: React.FC<IProps> = props => {

  const renderTransactions = () => (
    props.tx
      .filter(e => e.type === 'income')
      .sort((t1, t2) => t1.date.getTime() - t2.date.getTime())
      .map(txEntry)
  );
  return (
  <div className={props.className}>
    <h2>Income</h2>
    {renderTransactions()}
    <OutlinedButton onClick={props.fetchMore}>Fetch more</OutlinedButton>
  </div>
  );
};

export default styled(IncomeTransactions)`
  h2 {
    margin-bottom: 1em;
  }

  button {
    display: block;
    margin: 1em auto;
  }
`;
