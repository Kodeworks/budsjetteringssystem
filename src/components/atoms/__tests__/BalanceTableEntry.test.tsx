import React from 'react';

import { render } from '@testing-library/react';
import moment from 'moment';
import { IBalanceEntry } from '../../../declarations/balanceEntries';
import { currencyFormat } from '../../../helpers/currency';
import BalanceTableEntry from '../BalanceTableEntry';

test('BalanceTableEntry renders correctly', () => {
  const entryData = {
    date: '2019-06-28',
    expense: 200000,
    income: 100000,
    liquidity: 1000000,
  };
  const { container } = render((
    <BalanceTableEntry data={entryData} />
  ));
  const spans = container.querySelectorAll('span');

  expect(spans).not.toBe(null);
  if (spans) {
    expect(spans.length).toEqual(4);
    expect(spans[0].textContent).toEqual(moment(entryData.date).format('ddd[,] Do MMMM'));
    expect(spans[1].textContent).toEqual(currencyFormat(entryData.income / 100));
    expect(spans[2].textContent).toEqual(`(${currencyFormat(entryData.expense / 100)})`);
    expect(spans[3].textContent).toEqual(currencyFormat(entryData.liquidity / 100));
  }

});
