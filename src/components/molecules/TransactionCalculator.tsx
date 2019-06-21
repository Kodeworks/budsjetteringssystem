/**
 * @author "Fredrik August Madsen-Malmo"
 * @summary "This holds all the transactions added to the intermediary sum ``basket''. The point of this component
 *           is to give the user a simple overview of, and control over, the transactions to be summed up."
 */

import React from 'react';

import styled from 'styled-components';

import { TransactionCtx } from '../../contexts/transaction';

import { sum } from '../../helpers/intermediary_calc';

import TransactionEntry from '../atoms/TransactionEntry';

interface ITransactionCalculatorProps {
  className?: string;
}

const TransactionCalculator: React.FC<ITransactionCalculatorProps> = props => {
  const { store } = React.useContext(TransactionCtx);

  const findById = (e: number) => store.transactions.find(t => e === t.id)!;

  return (
    <div className={props.className}>
      <h1>Calculator</h1>
      <div>
        {store.intermediary.map(e => <TransactionEntry key={e} {...findById(e)} />)}
      </div>
      <h2>Sum: {sum(store).toFixed(2)}</h2>
    </div>
  );
};
export default styled(TransactionCalculator)`
  ${props => props.theme.shadow};
  padding: 2em;
  height: calc(100vh - 78px - 8em);
  position: sticky;
  right: 0;
  top: calc(78px + 4em);
  display: grid;
  grid-gap: 2em;

  div {
    max-height: 100%;
    overflow-y: auto;
  }

  div a {
    border: 0 !important;
    padding-left: 0 !important;
  }

  grid-template-rows: 2em auto 2em;
`;
