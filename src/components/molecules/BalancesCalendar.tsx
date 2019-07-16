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

const dayStrings = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const headers = () => {
  return dayStrings.map(d => <div key={d}><h3>{d}</h3></div>);
};

const Calendar: React.FC<ICalendarProps> = (props) => {
  const dayOfWeekStart = props.month.day() - 1;
  const monthLength = props.month.daysInMonth();
  const calendarEntries = [];

  for (let date = 1; date <= monthLength; date++) {
    calendarEntries[date - 1] = <BalancesCalendarEntry key={date} date={props.month.date(date).format('YYYY-MM-DD')} />;
  }

  props.entries.forEach(e => {
    calendarEntries[moment(e.date).date() - 1] = <BalancesCalendarEntry key={e.date} date={e.date} entry={e} />;
  });

  /* Generate empty entries for beginning of first week and end of last week in current month */
  const leadingEntries = () => {
    const leadingEntryArray = [];
    for (let i = 0; i < dayOfWeekStart; i++) {
      leadingEntryArray.push(<div className={'leading-entry'} key={dayStrings[i]} />);
    }
    return leadingEntryArray;
  };

  return ((
    <div className={props.className}>
      {headers()}
      {leadingEntries()}
      {calendarEntries}
    </div>
  ));
};

const BalancesCalendar = styled(Calendar)`
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
