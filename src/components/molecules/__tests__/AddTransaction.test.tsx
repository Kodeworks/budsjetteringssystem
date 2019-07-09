import React from 'react';

import {cleanup, render} from '../../../helpers/test-utils';
import AddTransaction from '../AddTransaction';

afterEach(cleanup);

describe('Submit transaction form', () => {
  test('it should render without crashing', () => {
    const { container } = render((
      <AddTransaction />
    ));
  });
});
