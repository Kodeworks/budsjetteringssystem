import {storiesOf} from '@storybook/react';
import React from 'react';

import { GlobalStyle } from '../styling/global';

import BalancesTable from '../components/molecules/BalancesTable';
import Balances from '../components/organism/Balances';
import { createTransactionCtx } from '../contexts/transaction';
import { IBalanceEntry } from '../declarations/balanceEntries';

/*
const Wrapper = props => {
  return (
    <GlobalStyle>
      {props.children}
    </GlobalStyle>
  )
};

addDecorator(storyFn => (
  <Wrapper>
    {storyFn()}
  </Wrapper>
));
const { store } = React.useContext(TransactionCtx);

const Wrapper = props => {
  const [store, dispatch] = React.useReducer(reducer, initialState);
  createTransactionCtx(store, dispacth);

  if (store.transactions.length === 0) {
    const txEntries = (new Array(100)).fill(1).map(createDummyTransaction);
    txEntries.map(e => dispatch(addTransaction(e)));
  }

  return (
    <TransactionCtx.Provider value={{store, dispatch}}>
      {props.children}
    </TransactionCtx.Provider>
  );
}
*/

const entries: Array<IBalanceEntry> = [
  {date: '1/6', income: 340000, expense: 100000, liquidity: 8430000},
  {date: '24/6', income: 100000, expense: 300000, liquidity: 8670000},
  {date: '25/6', income: 200050, liquidity: 8870000},
];

storiesOf('Balances', module)
  .add('Balances', () => (
    <Balances />
  ))
  .add('BalancesTable', () => (
    <BalancesTable entries={entries} />
  ));
