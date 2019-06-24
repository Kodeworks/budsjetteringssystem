import React from 'react';
import {storiesOf, addDecorator} from '@storybook/react'
//import {themes} from '@storybook/theming';
import { GlobalStyle } from '../styling/global';

import BalancesTable from '../components/molecules/BalancesTable';
import { createTransactionCtx } from '../contexts/transaction';

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

storiesOf('BalancesList', module)
  .add('BalancesTable', () => (
    <BalancesTable />
  ));