import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { createTransactionCtx, TransactionCtx } from '../contexts/transaction';
import { ActionCreators, initialState, reducer } from '../reducers/transactions';
import { GlobalStyle } from '../styling/global';
import { theme } from '../styling/theme';
import { AuthCtx } from './../contexts/auth';
import {  ILoginResponse } from './../mitochondria/auth';
import { createDummyTransaction } from './transaction_creator';

interface IWrapperProps {
  className?: string;
  auth?: ILoginResponse;
}

/**
 * This is a helper component which can be used to wrap the App, stories, tests etc.
 */

const GlobalWrapper: React.FC<IWrapperProps> = props => {
  const [store, dispatch] = React.useReducer(reducer, initialState);
  /**
   * If we haven't initialized the context, we want to create it here.
   */
  if (!TransactionCtx) {
    createTransactionCtx(store, dispatch);

    for (let i = 0; i < 100; i++) {
      dispatch(ActionCreators.addTransaction(createDummyTransaction()));
    }
  }

  return (
    <AuthCtx.Provider value={props.auth || { access: '', refresh: '' }}>
      <TransactionCtx.Provider value={{store, dispatch}}>
        <GlobalStyle />
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <div className={props.className}>
              {props.children}
            </div>
          </ThemeProvider>
        </BrowserRouter>
      </TransactionCtx.Provider>
    </AuthCtx.Provider>
  );
};

export default GlobalWrapper;
