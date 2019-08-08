import 'jest-dom/extend-expect';
import React from 'react';
import { cleanup, fireEvent, render } from '../../../helpers/test-utils';
import Tab from '../Tab';
import TabsContainer from '../TabsContainer';

afterEach(cleanup);

test('TabsContainer renders tabs and tabpanels correctly, and switches tabpanel when a tab is clicked.', () => {
  const label1 = 'Tab-1';
  const content1 = 'Tab-1 content';
  const label2 = 'Tab-2';
  const content2 = 'Tab-2 content';

  const { getByTestId, getByText, queryByText } = render(
    <TabsContainer>
      <Tab label={label1}>
        <h2>{content1}</h2>
      </Tab>
      <Tab label={label2}>
        <h2>{content2}</h2>
      </Tab>
    </TabsContainer>
  );

  expect(getByTestId('Tab-menu'));
  expect(getByText(label1));
  expect(getByText(label2));
  expect(getByText(content1));
  expect(queryByText(content2)).toBeNull();

  // Switching tabpanels through a click event
  fireEvent.click(getByText(label2));
  expect(getByText(content2));
  expect(queryByText(content1)).toBeNull();
});
