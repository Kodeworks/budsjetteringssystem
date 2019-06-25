import { getByText, render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalWrapper from '../../../helpers/GlobalWrapper';
import NavigationPill from '../NavigationPill';

test('loads with children and href', () => {
  const testChild = (<p>Test link</p>);
  const testHref = '/tests';

  const { container } = render((
    <GlobalWrapper>
      <NavigationPill children={testChild} active={true} to={testHref} />
    </GlobalWrapper>
  ));

  const paragraph = container.querySelector('p');
  const anchor = container.querySelector('a');
  expect(paragraph).not.toBe(null);
  if (paragraph) {
    expect(paragraph.textContent).toBe('Test link');
  }
  expect(anchor).not.toBe(null);
  if (anchor) {
    expect(anchor.href).toEqual(`http://localhost${testHref}`);
  }
});
