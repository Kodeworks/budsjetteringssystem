import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

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
      className={props.className}
      style={
        isInIntermediary
          ? { paddingLeft: '.6em', borderLeft: '4px solid black' }
          : {}
      }
    >
      <h4 onClick={invert(setShowMore)}>{props.description}</h4>
      <strong>
        {props.type === 'EX'
          ? `(${(props.money / 100).toFixed(2)})`
          : (props.money / 100).toFixed(2)}
      </strong>
      <h6>
        {moment(props.date).format('L')}
        {props.recurring_transaction_id &&
          ` - Recurring${isOverride ? ' override' : ''}`}
      </h6>
      {showMore && (
        <div>
          <p>{props.notes}</p>
          <Button onClick={onClickDelete}>Delete</Button>
          <Button onClick={invert(setShowUpdate)}>
            {showUpdate ? 'Hide update form' : 'Show update form'}
          </Button>
          {props.recurring_transaction_id && !isOverride && (
            <Button onClick={invert(setShowRecurringOverrideCreator)}>
              {showRecurringOverrideCreator ? 'Hide' : 'Show'} override
              recurring entry
            </Button>
          )}
          {showUpdate && (
            <EditTransaction
              tx={props}
              isOverride={isOverride}
              toggleMore={toggleMore}
            />
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
  grid-template-columns: 70% 30%;
  transition: padding 0.2s, margin 0.2s;
  text-decoration: none;
  color: black;

  & > *:nth-child(2n):not(div) {
    text-align: right;
  }

  h6,
  strong {
    font-weight: 300;
  }

  h4 {
    font-weight: 400;
    cursor: pointer;
  }

  div {
    grid-column: 1 / span 2;
    text-align: left;
  }

  &:hover {
    padding-left: 0.3em;
    border-left: 2px solid black;
  }
`;
