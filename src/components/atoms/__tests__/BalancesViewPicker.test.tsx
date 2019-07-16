import 'jest-dom/extend-expect';
import React from 'react';
import { cleanup, fireEvent, getByTestId, render } from '../../../helpers/test-utils';
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

  const { container, getByText, getByTestId } = render((
    <WrapperFC startShowCalendar={true} />
  ));

  expect(getByTestId('show-calendar')).toHaveTextContent('true');
  expect(getByText('Calendar'));
  expect(getByText('List'));

  const selectElement = container.querySelector('select');
  expect(selectElement);
  if (selectElement && selectElement.value) {
    expect(selectElement.value).not.toEqual('list');
    expect(selectElement.value).toEqual('calendar');

    // Select 'List view' and check that state and select-value has changed.
    fireEvent.change(selectElement, { target: {value: 'list'}});
    expect(getByTestId('show-calendar')).toHaveTextContent('false');
    expect(selectElement.value).toEqual('list');
    expect(selectElement.value).not.toEqual('calendar');
  }
});
