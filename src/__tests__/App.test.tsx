import React from 'react';
import App from '../App';
import { render } from '../helpers/test-utils';

test('renders app without any problems', () => {
  expect(() => render(<App />)).not.toThrow();
});
