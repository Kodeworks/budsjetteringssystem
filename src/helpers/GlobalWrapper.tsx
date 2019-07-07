import React from 'react';

import { AuthCtx } from '../store/contexts/auth';

import { BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from './../styling/global';

import { IAuthContext } from '../store/contexts/auth';

import { ThemeProvider } from 'styled-components';

import { TransactionProvider } from '../store/contexts/transactions';
import { theme } from './../styling/theme';
import { TransactionMocker } from './transaction_creator';

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
  const WrapWithAuth: React.FC = ({ children }) => {
    return props.auth ? (
      <AuthCtx.Provider value={props.auth}>{children}</AuthCtx.Provider>
    ) : (
      <>{children}</>
    );
  };

  return (
    <WrapWithAuth>
      <TransactionProvider>
        <TransactionMocker quantity={100} />
        <GlobalStyle />
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <div className={props.className}>{props.children}</div>
          </ThemeProvider>
        </BrowserRouter>
      </TransactionProvider>
    </WrapWithAuth>
  );
};

export default GlobalWrapper;
