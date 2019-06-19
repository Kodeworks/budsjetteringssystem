import { getByText, render } from '@testing-library/react';
import React from 'react';
import AddButton from '../AddButton';

test('AddButton loads with text: \'+\' and given \'className\'', () => {
  const testClassName = 'testClassName';
  const { container } = render((
    <AddButton className={'testClassName'} />
  ));

  expect(getByText(container, '+').textContent).toEqual('+');
  expect(getByText(container, '+').className).toContain(testClassName);
});
