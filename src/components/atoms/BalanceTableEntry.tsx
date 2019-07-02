import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import {IBalanceEntry} from '../../declarations/balanceEntries';
import { currencyFormat } from '../../helpers/currency';

interface IPropsTableEntry {
  className?: string;
  data: IBalanceEntry;
}

const tableEntry: React.FC<IPropsTableEntry> = props => {

  return (
    <div className={props.className}>
      <span>{moment(props.data.date).format('ddd[,] Do MMMM')}</span>
      <span>{`${props.data.income ? currencyFormat((props.data.income / 100)) : ''}`}</span>
      <span>{`${props.data.expense ? `(${currencyFormat((props.data.expense / 100))})` : ''}`}</span>
      <span>{currencyFormat((props.data.liquidity / 100))}</span>
    </div>
  );
};

const BalanceTableEntry = styled(tableEntry)`
  display: grid;
  margin-bottom: 1em;
  grid-template-columns: 25% 25% 25% 25%;
  width: calc(90% - 1em);
  text-align: right;
  span {
    font-weight: 400;
    font-size: 0.85em;
    &:first-of-type {
      text-align: left;
      font-weight: 700;
    }
  }
`;

export default BalanceTableEntry;
