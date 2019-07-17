import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from './../styling/global';

import { ThemeProvider } from 'styled-components';

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
    <CompanyProvider>
      <TransactionProvider>
        <GlobalStyle />
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <div className={props.className}>{props.children}</div>
          </ThemeProvider>
        </BrowserRouter>
      </TransactionProvider>
    </CompanyProvider>
  );
};

export default GlobalWrapper;
