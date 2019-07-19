import React, { Dispatch, SetStateAction } from 'react';

import Input from './Input';
import Select from './Select';

export type IntervalType = 'month' | 'week';

interface IProps {
  intervalValue: number;
  setInterval: Dispatch<SetStateAction<number>>;
  intervalTypeValue: IntervalType;
  DoMValue: number;
  setTypeInterval: Dispatch<SetStateAction<IntervalType>>;
  setDoM: Dispatch<SetStateAction<number>>;
}

const selectOptions = [
  { name: 'Day', value: 'day' },
  { name: 'Month', value: 'month' },
];

const RecurringTransactionOptions: React.FC<IProps> = props => {
  const DayOfMonth = (
    <Input
      type="number"
      id="dateofmonth"
      placeholder="23."
      value={props.DoMValue}
      setState={props.setDoM}
    >
      Day of month
    </Input>
  );

  return (
    <>
      <Input
        type="number"
        id="intervalCount"
        placeholder="3"
        value={props.intervalValue}
        setState={props.setInterval}
      >
        Interval
      </Input>
      <Select
        id="intervalType"
        values={selectOptions}
        value={props.intervalTypeValue}
        setState={props.setTypeInterval as Dispatch<SetStateAction<string>>}
      >
        Interval type
      </Select>
      {/* We only want to show the day of month input if monthly recurrence is selected.*/}
      {props.intervalTypeValue === 'month' && (
        <>
          {DayOfMonth}
          <br />
        </>
      )}
    </>
  );
};

export default RecurringTransactionOptions;
