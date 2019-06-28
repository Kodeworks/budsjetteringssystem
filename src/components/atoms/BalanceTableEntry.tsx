import React from 'react';
import styled from 'styled-components';
import {IBalanceEntry} from '../../declarations/balanceEntries';

interface IPropsTableEntry {
  className?: string;
  data: IBalanceEntry;
}

const tableEntry: React.FC<IPropsTableEntry> = props => {

  return (
    <div className={props.className}>
      <span>{props.data.date}</span>
      <span>{`${props.data.income ? (props.data.income / 100).toFixed(2) : ''}`}</span>
      <span>{`${props.data.expense ? `(${(props.data.expense / 100).toFixed(2)})` : ''}`}</span>
      <span>{(props.data.liquidity / 100).toFixed(2)}</span>
    </div>
  );
};

const BalanceTableEntry = styled(tableEntry)`
  display: grid;
  margin-bottom: 1em;
  grid-template-columns: 25% 25% 25% 25%;
  width: calc(70% - 1em);
  text-align: right;
  span {
    font-weight: 400;
    font-size: 0.8em;
    &:first-of-type {
      text-align: left;
    }
  }
`;

export default BalanceTableEntry;
