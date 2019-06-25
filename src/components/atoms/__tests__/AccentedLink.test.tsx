import React from 'react';

import { getByText, render } from '@testing-library/react';
import GlobalWrapper from '../../../helpers/GlobalWrapper';
import AccentedLink from '../AccentedLink';

test('AccentedLink loads with \'to\', \'className\', and children', () => {
  const testTo = '/tests';
  const testText = 'Test';
  const testClassName = 'testClass';
  const { container } = render((
    <GlobalWrapper>
      <AccentedLink to="/tests" className={'testClass'}>
        Test
      </AccentedLink>
    </GlobalWrapper>
  ));
  const anchorElement = container.querySelector('a');

  expect(anchorElement).not.toBe(null);
  if (anchorElement !== null) {
    expect(anchorElement.href).toEqual(`http://localhost${testTo}`);
  }
  expect(getByText(container, 'Test').className).toContain(testClassName);
  expect(getByText(container, 'Test').textContent).toBe(testText);
});
