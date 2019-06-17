import React from 'react';
import styled from 'styled-components';
import { ITransaction, TransactionType } from '../../../declarations/transaction';

const IncomeExpenseIcon = styled.span<Pick<ITransaction, 'type'>>`
  color: ${props => props.type === TransactionType.expense ? '#ff6961' : '#77dd77'};
  padding-right: .3em;
`;

const DashboardTransactionEntry: React.FC<ITransaction & { className?: string }> = props => (
  <div className={props.className}>
    <h4>{props.name}</h4>
    <strong>
      {props.type === TransactionType.expense ? `(${(props.money / 100).toFixed(2)})` : (props.money / 100).toFixed(2)}
    </strong>
    <h6>{props.date}</h6>
    <h6>
      <IncomeExpenseIcon type={props.type}>&#9632;</IncomeExpenseIcon>
      {props.type}
    </h6>
  </div>
);

export default styled(DashboardTransactionEntry)`
  display: grid;
  grid-template-rows: 1.6em 1em;
  grid-template-columns: 70% 30%;

  &>*:nth-child(2n) {
    text-align: right;
  }

  h6, strong {
    font-weight: 300;
  }

  h4 {
    font-weight: 400;
  }
`;
