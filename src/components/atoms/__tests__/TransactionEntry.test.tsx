import { fireEvent, getByText, render } from '@testing-library/react';
import React from 'react';
import { ITransaction, TransactionType } from '../../../declarations/transaction';
import TransactionEntry from '../TransactionEntry';

test('TransactionEntry', () => {
  const testId = 0;
  const testClassName = 'test';
  const testName = 'Kodeworks ASMR Inc';
  const testMoney = 50000;
  const testDate = '2019-08-22';
  const testCompanyId = 1;
  const testType = TransactionType.income;
  const testNotes = 'Edgy';

  const { container } = render((
    <TransactionEntry
      id={testId}
      className={testClassName}
      name={testName}
      money={testMoney}
      date={testDate}
      companyId={testCompanyId}
      type={TransactionType.income}
      notes={testNotes}
    />
  ));
  const div = container.querySelector('div');
  const header4 = container.querySelector('h4');
  const header6Array = container.querySelectorAll('h6');
  const paragraph = container.querySelector('p');
  const strong = container.querySelector('strong');

  /* Component should render with props given */
  expect(div).not.toBe(null);
  if (div) {
    expect(div.className).toContain(testClassName);
  }
  expect(header4).not.toBe(null);
  if (header4) {
    expect(header4.textContent).toEqual(testName);
  }
  expect(header6Array.length).toBe(2);
  expect(header6Array[0].textContent).toContain(testType);
  expect(header6Array[1].textContent).toContain(testDate);
  expect(paragraph).not.toBe(null);
  if (paragraph) {
    expect(paragraph.textContent).toEqual('');
  }
  expect(strong).not.toBe(null);
  if (strong) {
    expect(strong.textContent).toEqual(`${(testMoney / 100).toFixed(2)}`);
  }

  /* Hovering over TransactionEntry component should display paragraph */
  if (header4 && paragraph) {
    fireEvent.mouseEnter(header4);
    expect(paragraph.textContent).toEqual(testNotes);
  }

});
