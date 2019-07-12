import React from 'react';
import { createDummyTransaction } from '../../../helpers/transaction_creator';
import {
  TransactionProvider,
  useTransactionDispatch,
} from '../../../store/contexts/transactions';
import { ActionCreators} from '../../../store/reducers/transactions';
import { theme } from '../../../styling/theme';
import { cleanup, fireEvent, render } from './../../../helpers/test-utils';

import { ThemeProvider } from 'styled-components';
import { AuthCtx, createAuthCtx } from '../../../store/contexts/auth';
import { initialState, reducer as authReducer } from '../../../store/reducers/auth';
import Transactions from '../../organism/Transactions';

afterEach(cleanup);

const dummyTxs = new Array(50).fill(0).map(createDummyTransaction);

const Wrapper: React.FC = props => {
  const transactionDispatch = useTransactionDispatch();
  React.useEffect(
    () => {
    transactionDispatch(ActionCreators.resetTransactions(dummyTxs));
    }, [transactionDispatch]);

  const [auth, authDispatch] = React.useReducer(authReducer, initialState);
  createAuthCtx(auth, authDispatch);
  return (
    <AuthCtx.Provider value={{store: auth, dispatch: authDispatch}}>
      <ThemeProvider theme={theme}>
        <>
          {props.children}
        </>
      </ThemeProvider>
    </AuthCtx.Provider>
  );
};

test('Shows all by default', () => {
  const { container } = render((
    <Wrapper>
      <Transactions />
    </Wrapper>
    ), {wrapper: TransactionProvider});

  expect(container.querySelectorAll('h4~strong~h6').length).toBe(50);
});

test('Only show recurring', () => {
  const { container, getByLabelText, getByText } = render((
    <Wrapper>
      <Transactions />
    </Wrapper>
  ), {wrapper: TransactionProvider});

  fireEvent.click(getByText('Filters')); // show filters
  fireEvent.click(getByLabelText('Only recurring?'));
  dummyTxs.forEach(e => {
    expect(container.querySelectorAll('h4~strong~h6').length).toBe(
      dummyTxs.filter(t => t.recurring_id).length,
    );
  });
});

test('Filter on description', () => {
  const { getByLabelText, getByText, rerender, queryAllByText } = render((
    <Wrapper>
      <Transactions />
    </Wrapper>
  ), {wrapper: TransactionProvider});

  const filter = 'Otter';

  fireEvent.click(getByText('Filters')); // show filters
  fireEvent.change(getByLabelText('Description'), {
    target: { value: filter },
  });

  expect((getByLabelText('Description') as HTMLInputElement).value).toBe(
    filter,
  );

  dummyTxs.forEach(e => {
    expect(queryAllByText(new RegExp(filter)).length).toBe(
      dummyTxs.filter(t => new RegExp(filter).test(t.description)).length,
    );
  });
});

test('Filter on date', () => {
  const {
    container,
    getByLabelText,
    getByText,
    rerender,
    queryAllByText,
  } = render((
    <Wrapper>
      <Transactions />
    </Wrapper>
  ));

  const fromDate = '2000-01-01';
  const toDate = '2010-01-01';

  fireEvent.click(getByText('Filters')); // show filters
  fireEvent.change(getByLabelText('From date'), {
    target: { value: fromDate },
  });
  fireEvent.change(getByLabelText('To date'), { target: { value: toDate } });

  expect((getByLabelText('From date') as HTMLInputElement).value).toBe(
    fromDate,
  );
  expect((getByLabelText('To date') as HTMLInputElement).value).toBe(toDate);

  dummyTxs.forEach(e => {
    expect(container.querySelectorAll('h4~strong~h6').length).toBe(
      dummyTxs.filter(
        t =>
          new Date(fromDate) < new Date(t.date) &&
          new Date(t.date) < new Date(toDate),
      ).length,
    );
  });
});
