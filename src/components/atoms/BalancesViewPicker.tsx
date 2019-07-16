import React from 'react';
import styled from 'styled-components';

interface IBalancesViewPickerProps {
  className?: string;
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewPicker: React.FC<IBalancesViewPickerProps> = (props) => {
  const onViewChange = (event: React.FormEvent<HTMLSelectElement>) => {
   props.setShowCalendar(event.currentTarget.value === 'calendar');
  };

  return (
    <div className={props.className}>
      <label htmlFor="view-selector">View</label>
      <select
        id="view-selector"
        className="select-css"
        onChange={onViewChange}
        value={props.showCalendar ? 'calendar' : 'list'}
      >
        <option value="calendar">Calendar</option>
        <option value="list">List</option>
      </select>
    </div>
  );
};

const svgURL = `
data:image/svg+xml;
charset=US-ASCII,%3Csvg%20xmlns%3D%22
http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20
width%3D%22292.4%22%20
height%3D%22292.4%22%3E%3C
path%20
fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9
%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8
%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z
%22%2F%3E%3C%2Fsvg%3E
`;

const BalancesViewPicker = styled(ViewPicker)`
  margin-bottom: 2em;
  margin-left: 2em;
  display: grid;
  grid-template-columns: 95%;
  text-align: center;
  width: 10%

  label {
    text-align: center;
    font-weight: 700;
    font-size: 1.6em
  }

  .select-css {
    display: block;
    font-family: "Open Sans", sans-serif;
    font-weight: 400;
    font-size: 1em;
    line-height: .7em;
    text-align: center
    padding: 7px 2px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    margin-top: 0;
    border: none;
    box-shadow: ${props => props.theme.shadow};
    border-radius: ${props => props.theme.shape.borderRadius};
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: url(${svgURL}),
      linear-gradient(to bottom, #ffffff 0%,#ffffff 100%);
    background-repeat: no-repeat, repeat;
    background-position: right .7em top 50%, 0 0;
    background-size: .65em auto, 100%;
}
`;

export default BalancesViewPicker;
