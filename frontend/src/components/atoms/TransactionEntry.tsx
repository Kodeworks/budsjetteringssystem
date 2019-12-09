import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

import { currencyFormat } from '../../helpers/currency';
import { useTransactions } from '../../store/contexts/transactions';
import { TransactionActions } from '../../store/reducers/transactions';
import EditTransaction from '../molecules/EditTransaction';
import OverrideRecurringForm from '../molecules/OverrideRecurringForm';
import Button from './Button';

type ITransaction = import('../../declarations/transaction').ITransaction;

interface ITransactionEntryProps extends ITransaction {
  className?: string;
}

const TransactionEntry: React.FC<ITransactionEntryProps> = props => {
  const [store, transactionDispatch] = useTransactions();

  const [showMore, setShowMore] = React.useState(false);
  const [showUpdate, setShowUpdate] = React.useState(false);
  const [
    showRecurringOverrideCreator,
    setShowRecurringOverrideCreator,
  ] = React.useState(false);

  const isInIntermediary = !(
    store.intermediary.find(e => e === props.id) === undefined
  );

  const isOverride = !!store.recurring.find(r =>
    r.transactions.find(t => t === props.id)
  );

  const onClickDelete = async () => {
    if (props.recurring_transaction_id && !isOverride) {
      await TransactionActions.doDeleteRecurringTransaction(
        props.company_id,
        props.recurring_transaction_id,
        store.recurring.find(r => r.id === props.recurring_transaction_id)!
          .transactions,
        transactionDispatch
      );
    } else {
      await TransactionActions.doDeleteTransaction(
        props.company_id,
        props.id,
        transactionDispatch
      );
    }
  };

  const toggleMore = () => setShowMore(_ => !_);

  // invert setState hook value
  const invert = (fn: (value: React.SetStateAction<boolean>) => void) => () =>
    fn(_ => !_);

  return (
    <div
      style={
        isInIntermediary
          ? { paddingLeft: '.6em', borderLeft: '4px solid black' }
          : {}
      }
    >
      <div className={props.className} onClick={invert(setShowMore)}>
        <h4>{props.description}</h4>
        <strong>
          {props.type === 'EX'
            ? `(${currencyFormat(props.money / 100)})`
            : currencyFormat(props.money / 100)}
        </strong>
        <h6>
          {moment(props.date).format('L')}
          {props.recurring_transaction_id &&
            ` - Recurring${isOverride ? ' override' : ''}`}
        </h6>
      </div>
      {showMore && (
        <div>
          <p>{props.notes}</p>
          <Button onClick={onClickDelete}>
            {props.recurring_transaction_id
              ? isOverride
                ? 'Revert override'
                : 'Delete recurring transaction'
              : 'Delete transaction'}
          </Button>

          <Button onClick={invert(setShowUpdate)}>
            {props.recurring_transaction_id
              ? isOverride
                ? showUpdate
                  ? 'Stop editing override'
                  : 'Edit override'
                : showUpdate
                ? 'Stop editing recurring transaction'
                : 'Edit recurring transaction'
              : showUpdate
              ? 'Stop editing transaction'
              : 'Edit transaction'}
          </Button>

          {showUpdate && (
            <EditTransaction
              tx={props}
              isOverride={isOverride}
              toggleMore={toggleMore}
            />
          )}

          {props.recurring_transaction_id && !isOverride && (
            <Button onClick={invert(setShowRecurringOverrideCreator)}>
              {showRecurringOverrideCreator
                ? 'Stop overriding single entry'
                : 'Override single entry'}
            </Button>
          )}
          {showRecurringOverrideCreator && <OverrideRecurringForm tx={props} />}
        </div>
      )}
    </div>
  );
};

export default styled(TransactionEntry)`
  display: grid;
  grid-template-rows: 1.6em 1em auto;
  grid-template-columns: auto auto;
  transition: padding 0.2s, margin 0.2s, background-color 0.2s;
  text-decoration: none;
  color: black;
  cursor: pointer;
  padding-right: 0.3em;

  & > *:nth-child(2n):not(div) {
    text-align: right;
  }

  h4 {
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  h6,
  strong {
    font-weight: 300;
  }

  div {
    grid-column: 1 / span 2;
    text-align: left;
  }

  &:hover {
    padding-left: 0.3em;
    border-left: 2px solid black;
    background-color: ${props => props.theme.palette.hover.main};
  }
`;
