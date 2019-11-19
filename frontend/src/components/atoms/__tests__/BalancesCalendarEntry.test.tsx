import 'jest-dom/extend-expect';
import React from 'react';
import { cleanup, render } from '../../../helpers/test-utils';
import BalancesCalendarEntry from '../BalancesCalendarEntry';

afterEach(cleanup);

test('BalancesCalendarEntry renders correct data for given entry-object', () => {
  const entryData = {
    date: '2019-06-28',
    expense: 2000000,
    income: 1000000,
    liquidity: 10000000,
  };

  const { container, getByText } = render(
    <BalancesCalendarEntry date={entryData.date} entry={entryData} />
  );

  expect(getByText('28.'));
  expect(getByText('10 000'));
  expect(getByText('(20 000)'));
  expect(getByText('100 000'));
  expect(container.querySelector('hr')).not.toBe(null);
});

test('BalancesCalendarEntry only renders date when not given entry-object', () => {
  const date = '2019-06-15';

  const { container, getByText } = render(
    <BalancesCalendarEntry date={date} />
  );

  expect(getByText('15.'));
  expect(container.querySelector('hr')).toBe(null);
});
