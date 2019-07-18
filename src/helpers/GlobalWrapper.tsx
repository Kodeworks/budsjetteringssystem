import React from 'react';

import { GlobalStyle } from './../styling/global';

import { ThemeProvider } from 'styled-components';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../store/contexts/auth';
import { CompanyProvider } from '../store/contexts/company';
import { TransactionProvider } from '../store/contexts/transactions';
import { theme } from './../styling/theme';

interface IWrapperProps {
  className?: string;
}

/**
 * This is a helper component which can be used to wrap the App, stories, tests etc.
 */

const GlobalWrapper: React.FC<IWrapperProps> = props => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CompanyProvider>
          <TransactionProvider>
            <GlobalStyle />
            <ThemeProvider theme={theme}>
              <div className={props.className}>{props.children}</div>
            </ThemeProvider>
          </TransactionProvider>
        </CompanyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default GlobalWrapper;
