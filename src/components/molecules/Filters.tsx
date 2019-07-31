import React from 'react';

import Checkbox from '../atoms/Checkbox';
import Collapsable from '../atoms/Collapsable';
import Input from '../atoms/Input';

import queryString from 'query-string';

import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';

type ITransaction = import('../../declarations/transaction').ITransaction;

interface IFiltersProps {
  className?: string;
  setFilter: React.Dispatch<React.SetStateAction<(t: ITransaction) => boolean>>;
}

interface IFilterSettingsFromQuery {
  fromDate?: string;
  toDate?: string;
  desc?: string;
  recurring?: boolean;
}

const Filters: React.FC<IProps & RouteComponentProps<{}>> = props => {
  const [fromDate, setFromDate] = React.useState('1970-01-01');
  const [toDate, setToDate] = React.useState('2030-01-01');
  const [description, setDescription] = React.useState('');
  const [recurring, setRecurring] = React.useState(false);

  React.useEffect(() => {
    const {
      fromDate: qFromDate,
      toDate: qToDate,
      desc: qDesc,
      recurring: qRecurring,
    } = queryString.parse(window.location.search, {
      parseBooleans: true,
    }) as IFilterSettingsFromQuery;

    setFromDate(v => qFromDate || v);
    setToDate(v => qToDate || v);
    setDescription(v => qDesc || v);
    setRecurring(v => qRecurring || v);
  }, []);

  const setFilter = props.setFilter;

  React.useEffect(() => {
    if (
      `?${queryString.stringify({
        desc: description,
        fromDate,
        recurring,
        toDate,
      })}` !== props.location.search
    ) {
      props.history.push({
        search: `?${queryString.stringify({
          desc: description,
          fromDate,
          recurring,
          toDate,
        })}`,
      });
    }

    setFilter(() => (t: ITransaction) => {
      // If recurring filter is toggled and transaction is not of reccuring type
      // return false
      if (recurring && !t.recurring_transaction_id) {
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
  }, [
    fromDate,
    toDate,
    description,
    recurring,
    setFilter,
    props.location.search,
    props.history,
  ]);

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

export default styled(withRouter(Filters))`
  display: grid;
  grid-template-columns: 50% 50%;
  margin-top: 1em;
  grid-gap: 1em;
  width: calc(100% - 1em);
`;
