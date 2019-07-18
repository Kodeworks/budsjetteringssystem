import moment from 'moment';
import React from 'react';
import { fireEvent, render } from '../../../helpers/test-utils';
import MonthPicker from '../MonthPicker';

interface IProps {
  startMonth: moment.Moment;
}

test('MonthPicker renders and updates month when clicked', () => {
  const WrapperFC: React.FC<IProps> = props => {
    const [monthChosen, setMonthChosen] = React.useState<moment.Moment>(
      props.startMonth
    );

    return (
      <div className={'wrapper-fc'}>
        <p className={'monthState'}>{monthChosen.format('MMM YY')}</p>
        <MonthPicker month={monthChosen} setState={setMonthChosen} />
      </div>
    );
  };

  const startMonth = moment();
  const { container } = render(<WrapperFC startMonth={startMonth} />);
  const title = container.querySelector('h2');
  const monthState = container.querySelector('p');
  const monthDecrease = container.querySelector('.decrease');
  const monthIncrease = container.querySelector('.increase');
  const monthText = container.querySelectorAll('span')[1];

  if (title) {
    expect(title.textContent).toEqual('Month');
  }
  expect(monthDecrease).not.toBe(null);
  expect(monthIncrease).not.toBe(null);
  expect(monthText.textContent).toEqual(startMonth.format('MMM YY'));
  if (monthState) {
    expect(monthText.textContent).toEqual(monthState.textContent);
  }

  if (monthDecrease && monthState) {
    fireEvent.click(monthDecrease);
    expect(monthText.textContent).toEqual(
      startMonth
        .clone()
        .subtract(1, 'month')
        .format('MMM YY')
    );
    expect(monthText.textContent).toEqual(monthState.textContent);
  }

  if (monthIncrease && monthState) {
    fireEvent.click(monthIncrease);
    fireEvent.click(monthIncrease);
    expect(monthText.textContent).toEqual(
      startMonth.add(1, 'month').format('MMM YY')
    );
    expect(monthText.textContent).toEqual(monthState.textContent);
  }
});
