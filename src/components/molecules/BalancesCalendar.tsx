import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

import { IBalanceEntry } from '../../declarations/balanceEntries';
import BalancesCalendarEntry from '../atoms/BalancesCalendarEntry';

interface ICalendarProps {
  className?: string;
  entries: Array<IBalanceEntry>;
  month: moment.Moment;
}

const headers = () => {
  const dayStrings = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return dayStrings.map(d => <div key={d}><h3>{d}</h3></div>);
};

const calendar: React.FC<ICalendarProps> = (props) => {
  const dayOfWeekStart = props.month.day() - 1;
  const monthLength = props.month.daysInMonth();
  const calendarEntries = [];

  for (let date = 1; date <= monthLength; date++) {
    calendarEntries[date - 1] = <BalancesCalendarEntry date={props.month.date(date).format('YYYY-M-D')} />;
  }

  props.entries.forEach(e => {
    calendarEntries[moment(e.date).date() - 1] = <BalancesCalendarEntry date={e.date} entry={e} />;
  });

  /* Generate empty entries for beginning of first week and end of last week in current month */
  const emptyEntries = () => {
    const empties = [];
    for (let i = 0; i < dayOfWeekStart; i++) {
      empties.push(<div />);
    }
    return empties;
  };

  return ((
    <div className={props.className}>
      {headers()}
      {emptyEntries()}
      {calendarEntries}
    </div>
  ));
};

const BalancesCalendar = styled(calendar)`
  display: grid;
  margin-top: 4em;
  width: 80%;
  grid-template-columns: repeat(7, calc(100% / 7));
  text-align: center;

  h3 {
    margin: 0.5em 0;
  }
`;

export default BalancesCalendar;
