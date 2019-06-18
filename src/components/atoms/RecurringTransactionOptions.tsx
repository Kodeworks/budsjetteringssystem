import React from 'react';

import Input from './Input';

interface IProps {
  intervalValue: number;
  setInterval: React.Dispatch<React.SetStateAction<number>>;
  intervalTypeValue: string;
  DoMValue: number;
  setTypeInterval: React.Dispatch<React.SetStateAction<string>>;
  setDoM: React.Dispatch<React.SetStateAction<number>>;
}

const RecurringTransactionOptions: React.FC<IProps> = props => (
  <>
    {/* TODO: Convert this to a select */}
    <Input
      type="number"
      id="intervalCount"
      placeholder="3"
      value={props.intervalValue}
      setState={props.setInterval}
    >
      Interval
    </Input>
    <Input
      type="text"
      id="intervalType"
      placeholder="Month"
      value={props.intervalTypeValue}
      setState={props.setTypeInterval}
    >
      Interval type
    </Input>
    <Input
      type="number"
      id="dateofmonth"
      placeholder="23."
      value={props.DoMValue}
      setState={props.setDoM}
    >
      Day of month
    </Input>
    <br />
  </>
);

export default RecurringTransactionOptions;
