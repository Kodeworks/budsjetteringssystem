import React from 'react';

import { ActionCreators, initialState, reducer } from '../reducers/transactions';
import { AuthCtx } from './../contexts/auth';

import { BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from './../styling/global';

import { IAuthContext } from './../contexts/auth';

import { ThemeProvider } from 'styled-components';

import { createTransactionCtx, TransactionCtx } from './../contexts/transaction';
import { theme } from './../styling/theme';
import { createDummyTransaction } from './transaction_creator';

interface IWrapperProps {
  className?: string;

  /**
   * This is OPTIONAL as tests often don't need access to authentication related stuff, but we're
   * using this globally.
   */
  auth?: IAuthContext;
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

  const WrapWithAuth: React.FC = ({ children }) => {
    return props.auth ? (<AuthCtx.Provider value={props.auth}>{children}</AuthCtx.Provider>) : <>{children}</>;
  };

  return (
    <WrapWithAuth>
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
    </WrapWithAuth>
  );
};

export default GlobalWrapper;
