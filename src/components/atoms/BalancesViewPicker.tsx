import React from 'react';
import styled from 'styled-components';

interface IBalancesViewPickerProps {
  className?: string;
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}

const viewPicker: React.FC<IBalancesViewPickerProps> = (props) => {
  const onViewChange = (event: React.FormEvent<HTMLSelectElement>) => {
   props.setShowCalendar(event.currentTarget.value === 'calendar');
  };

  return (
    <div className={props.className}>
      <h2>View</h2>
      <select onChange={onViewChange} value={props.showCalendar ? 'calendar' : 'list'}>
        <option value="calendar">Calendar</option>
        <option value="list">List</option>
      </select>
    </div>
  );
};

const BalancesViewPicker = styled(viewPicker)`
  justify-self: center
  width: 100px;
  margin-left: 4em;

  h2 {
    text-align: center;
  }

  select {
    width: 100%;
  }
`;

export default BalancesViewPicker;
