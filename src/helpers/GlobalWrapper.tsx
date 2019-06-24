import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { createTransactionCtx, TransactionCtx } from '../contexts/transaction';
import { ActionCreators, initialState, reducer } from '../reducers/transactions';
import { GlobalStyle } from '../styling/global';
import { theme } from '../styling/theme';
import { createDummyTransaction } from './transaction_creator';

interface IWrapperProps {
  /* This makes the Wrapper stylable with styled-components
     Example:
      styled(Wrapper)`
        ...styling goes here...
      `
  */
  className?: string;
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
  );
};

export default GlobalWrapper;
