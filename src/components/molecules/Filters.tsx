import React from 'react';

import Checkbox from '../atoms/Checkbox';
import Collapsable from '../atoms/Collapsable';
import Input from '../atoms/Input';

import styled from 'styled-components';

interface IProps {
  className?: string;
}

const Filters: React.FC<IProps> = props => {
  const [fromDate, setFromDate] = React.useState('1970-01-01');
  const [toDate, setToDate] = React.useState('2020-01-01');
  const [customer, setCustomer] = React.useState('');
  const [recurring, setRecurring] = React.useState(false);

  return (
    <Collapsable heading={<h1>Filters</h1>} open={true}>
      <div className={props.className}>
        <Input value={fromDate} id="fromDate" type="date" setState={setFromDate}>From date</Input>
        <Input value={toDate} id="toDate" type="date" setState={setToDate}>To date</Input>
        <Input
          value={customer}
          id="customer"
          type="text"
          placeholder="Otter Accessories Inc."
          setState={setCustomer}
        >
          Customer
        </Input>
        <br /> {/* Simple hack to force checkbox to render on the next row */}
        <Checkbox value={recurring} setState={setRecurring} id="recurring">Only recurring?</Checkbox>
      </div>
    </Collapsable>
  );
};

export default styled(Filters)`
  display: grid;
  grid-template-columns: 50% 50%;
  margin-top: 1em;
  width: 50%;
  grid-gap: 1em;
`;
