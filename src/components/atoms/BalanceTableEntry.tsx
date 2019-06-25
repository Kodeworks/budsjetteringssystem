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
      <h6>{props.data.date}</h6>
      <h6>{`${props.data.income ? (props.data.income / 100).toFixed(2) : ''}`}</h6>
      <h6>{`${props.data.expense ? `(${(props.data.expense / 100).toFixed()})` : ''}`}</h6>
      <h6>{(props.data.liquidity / 100).toFixed(2)}</h6>
    </div>
  );
};

const BalanceTableEntry = styled(tableEntry)`
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  width: calc(70% - 1em);
  text-align: right;
  h6 {
    font-weight: 300;
    font-size: 0.8em;
  }
`;

export default BalanceTableEntry;
