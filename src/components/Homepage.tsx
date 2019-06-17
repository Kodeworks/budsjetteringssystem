import React from 'react';
import styled from 'styled-components';
import { ITransaction, TransactionType } from '../declarations/transaction';
import DashboardTransactions from './molecules/DashboardTransactions';

const txEntries: Array<ITransaction> = [
  { id: 0, name: 'Cute otter pictures', money: 25089, type: TransactionType.expense, date: '23. august', companyId: 0 },
  { id: 1, name: 'Weird gerbils', money: 120308, type: TransactionType.expense, date: '23. august', companyId: 0 },
  { id: 2, name: 'Cats with hats', money: 6516813, type: TransactionType.expense, date: '23. august', companyId: 0 },
  { id: 3, name: 'Constructive', money: 2105089, type: TransactionType.income, date: '26. august', companyId: 0 },
  { id: 4, name: 'Cute hats', money: 616823, type: TransactionType.expense, date: '23. august', companyId: 0 },
];

interface IProps {
  className?: string;
}

const Homepage: React.FC<IProps> = ({ className }) => (
  <div className={className}>
    <DashboardTransactions transactions={txEntries} />
  </div>
);

export default styled(Homepage)`
  display: grid;
  grid-template-columns: 30% 40% 30%;
`;
