import React from 'react';
import styled from 'styled-components';
import { ITransaction, TransactionType } from '../../../declarations/transaction';

const IncomeExpenseIcon = styled.span<Pick<ITransaction, 'type'>>`
  color: ${props => props.type === TransactionType.expense ? '#ff6961' : '#77dd77'};
  padding-right: .3em;
`;

const DashboardTransactionEntry: React.FC<ITransaction & { className?: string }> = props => {
  const [displayNotes, setDisplayNotes] = React.useState(false);
  function toggleNotes() {
    setDisplayNotes(!displayNotes);
  }

  const { money } = props;

  return (
    <div className={props.className} onMouseEnter={toggleNotes} onMouseLeave={toggleNotes}>
      <h4>{props.name}</h4>
      <strong>
        {props.type === TransactionType.expense ? `(${(money / 100).toFixed(2)})` : (money / 100).toFixed(2)}
      </strong>
      <h6>{props.date}</h6>
      <h6>
        <IncomeExpenseIcon type={props.type}>&#9632;</IncomeExpenseIcon>
        {props.type}
      </h6>
      <p style={{ display: displayNotes && props.notes ? 'block' : 'none' }}>{props.notes}</p>
    </div>
  );
};

export default styled(DashboardTransactionEntry)`
  display: grid;
  grid-template-rows: 1.6em 1em auto;
  grid-template-columns: 70% 30%;
  transition: padding .2s, margin .2s;

  &>*:nth-child(2n) {
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
    box-shadow: 2px 2px 5px 0px #ccc;
    padding: 1em;
    margin: 0px -1em;
    cursor: pointer;
  }
`;
