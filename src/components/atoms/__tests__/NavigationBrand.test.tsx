import { getByText, render } from '@testing-library/react';
import React from 'react';
import NavigationBrand from '../NavigationBrand';

test('NavigationBrand loads with classname and h2-tag', () => {
  const testClassName = 'test';
  const { container } = render(<NavigationBrand className={testClassName} />);

  const div = container.querySelector('div');
  expect(div).not.toBe(null);
  if (div) {
    expect(div.className).toContain(testClassName);
  }
  expect(getByText(container, 'LIQUIDATOR')).not.toBe(null);
});
