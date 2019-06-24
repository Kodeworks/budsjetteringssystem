import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { createTransactionCtx, TransactionCtx } from '../../../contexts/transaction';
import { ITransaction, TransactionType } from '../../../declarations/transaction';
import { createDummyTransaction } from '../../../helpers/transaction_creator';
import { ActionCreators, initialState, reducer } from '../../../reducers/transactions';

import Transactions from '../../organism/Transactions';

const dummyTxs = (new Array(50)).fill(0).map(createDummyTransaction);

afterEach(cleanup);

const Wrapper: React.FC = props => {
  const [store, dispatch] = React.useReducer(reducer, initialState);

  createTransactionCtx(store, dispatch);

  if (store.transactions.length === 0) {
    dummyTxs.map(e => dispatch(ActionCreators.addTransaction(e)));
  }

  return (
    <TransactionCtx.Provider value={{store, dispatch}}>
      {props.children}
    </TransactionCtx.Provider>
  );
};

test('Shows all by default', () => {
  const { container } = render((
    <Wrapper>
      <Transactions />
    </Wrapper>
  ));

  dummyTxs.forEach(e => {
    expect(container.querySelectorAll('h4~strong~h6').length).toBe(50);
  });
});

test('Only show recurring', () => {
  const { container, getByLabelText, getByText } = render((
    <Wrapper>
      <Transactions />
    </Wrapper>
  ));

  fireEvent.click(getByText('Filters')); // show filters
  fireEvent.click(getByLabelText('Only recurring\?'));

  dummyTxs.forEach(e => {
    expect(container.querySelectorAll('h4~strong~h6').length)
      .toBe(dummyTxs.filter(t => t.recurringId).length);
  });
});

test('Filter on description', () => {
  const { getByLabelText, getByText, rerender, queryAllByText } = render((
    <Wrapper>
      <Transactions />
    </Wrapper>
  ));

  const filter = 'Otter';

  fireEvent.click(getByText('Filters')); // show filters
  fireEvent.change(getByLabelText('Description'), { target: { value: filter } });

  expect((getByLabelText('Description') as HTMLInputElement).value).toBe(filter);

  dummyTxs.forEach(e => {
    expect(queryAllByText(new RegExp(filter)).length)
      .toBe(dummyTxs.filter(t => new RegExp(filter).test(t.description)).length);
  });
});

test('Filter on date', () => {
  const { container, getByLabelText, getByText, rerender, queryAllByText } = render((
    <Wrapper>
      <Transactions />
    </Wrapper>
  ));

  const fromDate = '2000-01-01';
  const toDate   = '2010-01-01';

  fireEvent.click(getByText('Filters')); // show filters
  fireEvent.change(getByLabelText('From date'), { target: { value: fromDate} });
  fireEvent.change(getByLabelText('To date'), { target: { value: toDate} });

  expect((getByLabelText('From date') as HTMLInputElement).value).toBe(fromDate);
  expect((getByLabelText('To date') as HTMLInputElement).value).toBe(toDate);

  dummyTxs.forEach(e => {
    expect(container.querySelectorAll('h4~strong~h6').length)
    .toBe(
      dummyTxs.filter(t => (new Date(fromDate) < new Date(t.date)) && (new Date(t.date) < new Date(toDate))).length,
    );
  });
});
