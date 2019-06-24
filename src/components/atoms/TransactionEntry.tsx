import React from 'react';

import styled from 'styled-components';

import { ActionCreators } from '../../reducers/transactions';

import { ITransaction, TransactionType } from '../../declarations/transaction';

import { TransactionCtx } from '../../contexts/transaction';

const IncomeExpenseIcon = styled.span<Pick<ITransaction, 'type'>>`
  color: ${props => props.type === TransactionType.expense ? '#ff6961' : '#77dd77'};
  padding-right: .3em;
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
  const [displayNotes, setDisplayNotes] = React.useState(false);
  const { money, hideIncomeExpenseBadge } = props;

  const { store, dispatch } = React.useContext(TransactionCtx);

  const disableNotes = () => setDisplayNotes(false);
  const enableNotes = () => setDisplayNotes(true);

  const isInIntermediary = !(store.intermediary.find(e => e === props.id) === undefined);

  const onClick = () => isInIntermediary ?
    dispatch(ActionCreators.removeFromIntermediary(props.id)) :
    dispatch(ActionCreators.addToIntermediary(props.id));

  return (
    <div
      className={props.className}
      onMouseEnter={enableNotes}
      onMouseLeave={disableNotes}
      onClick={onClick}
      style={isInIntermediary ? {paddingLeft: '.6em', borderLeft: '4px solid black'} : {}}
    >
      <h4>{props.description}</h4>
      <strong>
        {props.type === TransactionType.expense ? `(${(money / 100).toFixed(2)})` : (money / 100).toFixed(2)}
      </strong>
      {!hideIncomeExpenseBadge && incomeExpenseBadge(props.type)}
      <h6>{props.date}{props.recurringId && ` ${String.fromCharCode(183)} Recurring`}</h6>
      <p>{displayNotes && props.notes}</p>
    </div>
  );
};

export default styled(TransactionEntry)`
  display: grid;
  grid-template-rows: 1.6em 1em auto;
  grid-template-columns: 70% 30%;
  transition: padding .2s, margin .2s;
  text-decoration: none;
  color: black;

  &>*:nth-child(2n):not(p) {
    text-align: right;
  }

  h6, strong {
    font-weight: 300;
  }

  h4 {
    font-weight: 400;
  }

  p {
    font-size: .7em;
    font-weight: 400;
    grid-column: 1 / span 2;
  }

  &:hover {
    padding-left: .3em;
    cursor: pointer;
    border-left: 2px solid black;
  }
`;
