import React from 'react';
import styled from 'styled-components';

interface IPropsTableEntry {
  className?: string;
  data: {
    date: Date;
    income?: number;
    expense?: number;
    liquidity: number;
  };
}

const tableEntry: React.FC<IPropsTableEntry> = props => {

  return (
    <div className={props.className}>
      <h6>{`${props.data.date.getDate()}.0${props.data.date.getMonth() + 1}`}</h6>
      <h6>{props.data.income}</h6>
      <h6>{`(${props.data.expense})`}</h6>
      <h6>{`${props.data.liquidity}`}</h6>
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
