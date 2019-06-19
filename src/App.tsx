import React from 'react';

import styled, { ThemeProvider } from 'styled-components';

import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './styling/theme';

import { createTransactionCtx, TransactionCtx } from './contexts/transaction';
import { addTransaction, initialState, reducer } from './reducers/transactions';

import { TransactionType } from './declarations/transaction';

import Navigation from './components/organism/Navigation';
import Transactions from './components/organism/Transactions';
import FAQ from './components/pages/FAQ';
import Homepage from './components/pages/Homepage';
import Page from './components/templates/Page';
import { GlobalStyle } from './styling/global';
import { navbarWidth } from './styling/sizes';

interface IProps {
  className?: string;
}

const App: React.FC<IProps> = ({ className }) => {
  const [store, dispatch] = React.useReducer(reducer, initialState);

  /**
   * If we haven't initialized the context, we want to create it here.
   */
  if (!TransactionCtx) {
    createTransactionCtx(store, dispatch);
    dispatch(
      addTransaction(
        { id: 42, name: 'Test tx', money: 123123123, date: '23.08.1999', companyId: 0, type:
          TransactionType.income, notes: 'Lipsum',
        },
      ),
    );
    dispatch(
      addTransaction(
        { id: 43, name: 'Test tx', money: 123123123, date: '23.08.1999', companyId: 0, type:
          TransactionType.expense, notes: 'Lipsum',
        },
      ),
    );
    dispatch(
      addTransaction(
        { id: 44, name: 'Test tx', money: 123123123, date: '23.08.1999', companyId: 0, type:
          TransactionType.income, notes: 'Lipsum',
        },
      ),
    );
    dispatch(
      addTransaction(
        { id: 45, name: 'Test tx', money: 123123123, date: '23.08.1999', companyId: 0, type:
          TransactionType.income, notes: 'Lipsum',
        },
      ),
    );
    dispatch(
      addTransaction(
        { id: 46, name: 'Test tx', money: 123123123, date: '23.08.1999', companyId: 0, type:
          TransactionType.expense, notes: 'Lipsum',
        },
      ),
    );
  }

  return (
    <TransactionCtx.Provider value={{store, dispatch}}>
      <ThemeProvider theme={theme}>
        <div className={className}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <Navigation />
            </ThemeProvider>
            <Page>
              <Route path="/" exact={true} component={Homepage} />
              <Route path="/faq" component={FAQ} />
              <Route path="/transactions" component={Transactions} />
            </Page>
          </BrowserRouter>
          <GlobalStyle />
        </div>
      </ThemeProvider >
    </TransactionCtx.Provider>
  );
};

export default styled(App)`
  /* Grid */
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: ${navbarWidth} auto;
  max-height: 100vh;

  nav {
    overflow-y: hidden;
  }

  &>section {
    overflow-y: auto;
  }

  /* Colors */
  background-color: ${props => props.theme.main};
`;
