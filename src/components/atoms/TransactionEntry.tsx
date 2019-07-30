import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

import { ITransaction, TransactionType } from '../../declarations/transaction';
import {
  useTransactionDispatch,
  useTransactions,
} from '../../store/contexts/transactions';
import { TransactionActions } from '../../store/reducers/transactions';

const IncomeExpenseIcon = styled.span<Pick<ITransaction, 'type'>>`
  color: ${props => (props.type === 'EX' ? '#ff6961' : '#77dd77')};
  padding-right: 0.3em;
`;

interface IProps extends ITransaction {
  className?: string;
  hideIncomeExpenseBadge?: boolean;
}

const incomeExpenseBadge = (type: TransactionType) => (
  <h6>
    <IncomeExpenseIcon type={type}>&#9632;</IncomeExpenseIcon>
    {type}
  </h6>
);

const TransactionEntry: React.FC<IProps> = props => {
  const transactionDispatch = useTransactionDispatch();

  const [showMore, setShowMore] = React.useState(false);
  const { money, hideIncomeExpenseBadge } = props;
  const [store, dispatch] = useTransactions();

  const [status, setStatus] = React.useState('');

  const isInIntermediary = !(
    store.intermediary.find(e => e === props.id) === undefined
  );

  const onClickDelete = async () => {
    try {
      setStatus('Deleting...');
      await TransactionActions.doDeleteTransaction(
        props.company_id,
        props.id,
        transactionDispatch
      );
    } catch (e) {
      setStatus(`Error encountered when deleting.`);
      setTimeout(() => {
        setStatus('');
      }, 3000);
    }
  };

  const onUpdateSubmit = async (tx: ITransaction) => {
    try {
      setStatus('Updating...');
      await TransactionActions.doUpdateTransaction(tx, transactionDispatch);
      setStatus('');
    } catch (e) {
      setStatus(`Error encountered when updating.`);
      setTimeout(() => {
        setStatus('');
      }, 3000);
    }
  };

  // invert
  const onClick = () => setShowMore(_ => !_);

  return (
    <div
      className={props.className}
      onClick={onClick}
      style={
        isInIntermediary
          ? { paddingLeft: '.6em', borderLeft: '4px solid black' }
          : {}
      }
    >
      {status && <strong>{status}</strong>}
      <h4>{props.description}</h4>
      <strong>
        {props.type === 'EX'
          ? `(${(money / 100).toFixed(2)})`
          : (money / 100).toFixed(2)}
      </strong>
      {!hideIncomeExpenseBadge && incomeExpenseBadge(props.type)}
      <h6>
        {moment(props.date).format('L')}
        {props.recurring_transaction_id &&
          `  ${String.fromCharCode(183)} Recurring`}
      </h6>
      {showMore && (
        <div>
          <p>{props.notes}</p>
          <button onClick={onClickDelete}>Delete</button>
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
  }

  div {
    font-size: 0.7em;
    font-weight: 400;
    grid-column: 1 / span 2;
    text-align: left;
  }

  &:hover {
    padding-left: 0.3em;
    cursor: pointer;
    border-left: 2px solid black;
  }
`;
