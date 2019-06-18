import React from 'react';
import styled from 'styled-components';

import AddTransaction from '../molecules/AddTransaction';
import ExpenseTransactions from '../molecules/ExpenseTransactions';
import Filters from '../molecules/Filters';
import IncomeTransactions from '../molecules/IncomeTransactions';

interface IProps {
  className?: string;
}

const Content = styled.div`
  &>div {
    margin-top: 2em;
  }
`;

const Transactions: React.FC<IProps> = ({ className }) => (
  <div className={className}>
    <h1>Transactions</h1>
    <h5>Showing all transactions</h5>

    <Content>
      <Filters />
      <AddTransaction />

      <div>
        <IncomeTransactions />
      </div>

      <div>
        <ExpenseTransactions />
      </div>
    </Content>
  </div>
);

export default styled(Transactions)`
  h1 {
    font-weight: 700;
    font-size: 1.8em;
  }

  h5 {
    font-weight: 300;
    line-height: .7em;
  }
`;
