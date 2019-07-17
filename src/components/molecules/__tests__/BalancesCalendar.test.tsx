import 'jest-dom/extend-expect';
import moment from 'moment';
import 'moment/locale/en-gb';
import React from 'react';
import { cleanup, render } from '../../../helpers/test-utils';
import BalancesCalendar from '../BalancesCalendar';

afterEach(cleanup);

test('BalancesCalendar renders entries correct', () => {
  const entries = [
    {
      date: '2019-06-01',
      expense: 200000,
      liquidity: 10000000,
    },
    {
      date: '2019-06-08',
      income: 200000,
      liquidity: 10200000,
    },
    {
      date: '2019-06-15',
      income: 400000,
      liquidity: 10600000,
    },
  ];

  const month = moment(entries[0].date);

  moment.locale('en-gb');

  const { container, getByText } = render((
    <BalancesCalendar entries={entries} month={month} />
  ));

  // Check that headers are rendered
  const weekdays = moment.weekdaysShort(true);
  weekdays.forEach(e => {
    expect(getByText(e));
  });

  // Check that entries for all dates of given month are rendered.
  for (let i = 0; i < month.daysInMonth(); i++) {
    expect(getByText(`${i + 1}.`));
  }

  expect(getByText('1.').parentElement).toHaveTextContent('(2,000.00)100,000.00');
  expect(getByText('8.').parentElement).toHaveTextContent('2,000.00');
  expect(getByText('15.').parentElement).toHaveTextContent('4,000.00106,000.00');
  expect(getByText('2.').parentElement).not.toHaveTextContent('(2,000.00)');

  // Check that it renders empty divs upto the day of the first of the month.
  // For June this would be 5 leading empty divs.
  expect(container.querySelectorAll('.leading-entry').length).toBe(5);
});
