import 'jest-dom/extend-expect';
import React from 'react';
import { cleanup, fireEvent, render } from '../../../helpers/test-utils';
import BalancesViewPicker from '../BalancesViewPicker';

afterEach(cleanup);

interface IProps {
  startShowCalendar: boolean;
}

test('ViewPicker renders with correct choice set', () => {
  const WrapperFC: React.FC<IProps> = (props) => {
    const [showCalendar, setShowCalendar] = React.useState<boolean>(props.startShowCalendar);

    return (
      <div className={'wrapper-fc'}>
        <p data-testid={'show-calendar'}>{`${showCalendar}`}</p>
        <BalancesViewPicker showCalendar={showCalendar} setShowCalendar={setShowCalendar} />
      </div>
    );
  } ;

  const { getByLabelText, getByText  } = render((
    <WrapperFC startShowCalendar={true} />
  ));

  expect(getByLabelText('View')).toHaveValue('calendar');
  expect(getByText('Calendar'));
  expect(getByText('List'));
  expect(getByLabelText('View')).not.toHaveValue('list');
  expect(getByLabelText('View')).toHaveValue('calendar');

  // Select 'List view' and check that state and select-value has changed.
  fireEvent.change(getByText('Calendar'), { target: {value: 'list'}});
  expect(getByLabelText('View')).toHaveValue('list');
  expect(getByLabelText('View')).not.toHaveValue('calendar');
});
