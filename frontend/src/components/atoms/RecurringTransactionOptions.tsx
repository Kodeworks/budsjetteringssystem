import React, { Dispatch, SetStateAction } from 'react';

import Input from './Input';
import Select from './Select';

export type IntervalType = 'MO' | 'DA';

interface IRecurringTransactionOptionsProps {
  intervalValue: number;
  setInterval: Dispatch<SetStateAction<number>>;
  intervalTypeValue: IntervalType;
  setTypeInterval: Dispatch<SetStateAction<IntervalType>>;
}

const selectOptions = [
  { name: 'Day', value: 'DA' },
  { name: 'Month', value: 'MO' },
];

const RecurringTransactionOptions: React.FC<
  IRecurringTransactionOptionsProps
> = props => (
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
  </>
);

export default RecurringTransactionOptions;
