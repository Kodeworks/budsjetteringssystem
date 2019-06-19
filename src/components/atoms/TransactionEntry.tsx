import React from 'react';
import styled from 'styled-components';
import { ITransaction, TransactionType } from '../../declarations/transaction';

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
  const { money, hideIncomeExpenseBadge } = props;

  return (
    <div className={props.className}>
      <h4>{props.name}</h4>
      <strong>
        {props.type === TransactionType.expense ? `(${(money / 100).toFixed(2)})` : (money / 100).toFixed(2)}
      </strong>
      {!hideIncomeExpenseBadge && incomeExpenseBadge(props.type)}
      <h6>{props.date}</h6>
      <p>{props.notes}</p>
    </div>
  );
};

export default styled(TransactionEntry)`
  display: grid;
  grid-template-rows: 1.6em 1em auto;
  grid-template-columns: 70% 30%;
  transition: padding .2s, margin .2s;

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
