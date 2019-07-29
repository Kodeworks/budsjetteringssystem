import React from 'react';

import Checkbox from '../atoms/Checkbox';
import Collapsable from '../atoms/Collapsable';
import Input from '../atoms/Input';

import styled from 'styled-components';
import { ITransaction } from '../../declarations/transaction';

interface IFiltersProps {
  className?: string;
  setFilter: React.Dispatch<React.SetStateAction<(t: ITransaction) => boolean>>;
}

const Filters: React.FC<IFiltersProps> = props => {
  const [fromDate, setFromDate] = React.useState('1970-01-01');
  const [toDate, setToDate] = React.useState('2030-01-01');
  const [description, setDescription] = React.useState('');
  const [recurring, setRecurring] = React.useState(false);

  React.useEffect(() => {
    props.setFilter(() => (t: ITransaction) => {
      // If recurring filter is toggled and transaction is not of reccuring type
      // return false
      if (recurring && !t.recurring_id) {
        return false;
      }

      if (t.date < fromDate || t.date > toDate) {
        return false;
      }

      if (description && !new RegExp(description, 'i').test(t.description)) {
        return false;
      }
      return true;
    });
  }, [fromDate, toDate, description, recurring, props]);

  return (
    <Collapsable heading={<h1>Filters</h1>}>
      <div className={props.className}>
        <Input
          value={fromDate}
          id="fromDate"
          type="date"
          setState={setFromDate}
        >
          From date
        </Input>
        <Input value={toDate} id="toDate" type="date" setState={setToDate}>
          To date
        </Input>
        <Input
          value={description}
          id="description"
          type="text"
          placeholder="Otter Accessories"
          setState={setDescription}
        >
          Description
        </Input>
        <br /> {/* Simple hack to force checkbox to render on the next row */}
        <Checkbox value={recurring} setState={setRecurring} id="recurring">
          Only recurring?
        </Checkbox>
      </div>
    </Collapsable>
  );
};

export default styled(Filters)`
  display: grid;
  grid-template-columns: 50% 50%;
  margin-top: 1em;
  grid-gap: 1em;
  width: calc(100% - 1em);
`;
