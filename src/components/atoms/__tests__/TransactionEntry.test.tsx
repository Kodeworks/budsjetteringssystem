import moment from 'moment';
import React from 'react';
import TransactionEntry from '../TransactionEntry';
import { fireEvent, render } from './../../../helpers/test-utils';

test('TransactionEntry', () => {
  const testId = 0;
  const testClassName = 'test';
  const testDescription = 'Kodeworks ASMR Inc';
  const testMoney = 50000;
  const testDate = '2019-08-22';
  const testCompanyId = 1;
  const testType = 'IN';
  const testNotes = 'Edgy';

  const { container } = render(
    <TransactionEntry
      id={testId}
      className={testClassName}
      description={testDescription}
      money={testMoney}
      date={testDate}
      company_id={testCompanyId}
      type={testType}
      notes={testNotes}
    />
  );
  const div = container.querySelector('div');
  const header4 = container.querySelector('h4');
  const header6Array = container.querySelectorAll('h6');
  const paragraph = container.querySelector('p');
  const strong = container.querySelector('strong');

  /* Component should render with props given */
  expect(div).not.toBe(null);
  expect(header4).not.toBe(null);
  if (header4) {
    expect(header4.textContent).toEqual(testDescription);
  }
  expect(header6Array.length).toBe(2);
  expect(header6Array[0].textContent).toContain(testType);
  expect(header6Array[1].textContent).toContain(moment(testDate).format('L'));
  expect(paragraph).toBe(null);
  expect(strong).not.toBe(null);
  if (strong) {
    expect(strong.textContent).toEqual(`${(testMoney / 100).toFixed(2)}`);
  }

  /* Hovering over TransactionEntry component should display paragraph */
  if (header4 && paragraph) {
    fireEvent.click(header4);
    expect(paragraph.textContent).toEqual(testNotes);
  }
});
