import moment from 'moment';
import React from 'react';
import { currencyFormat } from '../../../helpers/currency';
import { render } from '../../../helpers/test-utils';
import BalanceTable from '../BalancesTable';

test('BalanceTable renders correctly with headers and two BalanceEntries', () => {
  const entryData = [
    {
      date: '2019-06-12',
      expense: 200000,
      income: 100000,
      liquidity: 1000000,
    },
    {
      date: '2019-06-28',
      expense: 200000,
      income: 100000,
      liquidity: 1000000,
    },
  ];

  const { container } = render(
    <BalanceTable className={'balance-table'} entries={entryData} />
  );

  const table = container.querySelector('.balance-table');
  expect(table).not.toBe(null);
  if (table !== null) {
    const children = table.children;
    expect(children.length).toEqual(3);
    expect(children[0].children.length).toEqual(4);

    const headers = children[0].children;
    expect(headers[0].textContent).toEqual('Date');
    expect(headers[1].textContent).toEqual('Income');
    expect(headers[2].textContent).toEqual('Expense');
    expect(headers[3].textContent).toEqual('Liquidity');

    const balanceEntry1 = children[1].children;
    const balanceEntry2 = children[2].children;
    expect(balanceEntry1.length).toEqual(4);
    expect(balanceEntry2.length).toEqual(4);
    expect(balanceEntry1[0].textContent).toEqual(
      moment(entryData[0].date).format('ddd[,] Do MMMM')
    );
    expect(balanceEntry2[2].textContent).toEqual(
      `(${currencyFormat(entryData[1].expense / 100)})`
    );
  }
});
