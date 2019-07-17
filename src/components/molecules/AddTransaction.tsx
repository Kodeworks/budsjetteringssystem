import React from 'react';
import styled from 'styled-components';

import Checkbox from '../atoms/Checkbox';
import Collapsable from '../atoms/Collapsable';
import Input from '../atoms/Input';
import OutlinedButton from '../atoms/OutlinedButton';
import RecurringTransactionOptions from '../atoms/RecurringTransactionOptions';
import TextArea from '../atoms/TextArea';

import { TransactionType } from '../../declarations/transaction';
import { useTransactionDispatch } from '../../store/contexts/transactions';
import { createTransaction } from '../../store/reducers/transactions';

interface IProps {
  className?: string;
}

const AddTransaction: React.FC<IProps> = props => {
  const dispatch = useTransactionDispatch();
  const [transactionType, setTransactionType] = React.useState<TransactionType>(
    'expense'
  );
  const [date, setDate] = React.useState('1970-01-01');
  const [amount, setAmount] = React.useState('');
  const [name, setName] = React.useState('');
  const [counterpart, setCounterpart] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [recurring, setRecurring] = React.useState(false);
  const [interval, setInterval] = React.useState(1);
  const [intervalType, setIntervalType] = React.useState('Month');
  const [dayOfMonth, setDayOfMonth] = React.useState(23);
  const [, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /*  TODO – company_id should be read from the state. For now it is hard coded.
        Because api uses snake_case, disable tslint (lowerCamelCase) variable-name rule:
     */
    // tslint:disable-next-line: variable-name
    const company_id = 1;
    if (!recurring) {
      const formValues = {
        company_id,
        date,
        description: name,
        money: parseFloat(amount),
        notes,
        type: transactionType,
      };
      try {
        createTransaction(formValues, dispatch);
      } catch (e) {
        setError(e.message);
        /* TODO – handle and display error to the user */
        // tslint:disable-next-line: no-console
        console.error(e.message);
      }
    } else {
      /* TODO – Add functionality for recurring transaction */
      alert('Adding recurring transaction is not yet possible');
    }
  };

  const handleTransactionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransactionType(event.target.value as TransactionType);
  };

  const recurringTransactionOptions = (
    <RecurringTransactionOptions
      intervalValue={interval}
      intervalTypeValue={intervalType}
      DoMValue={dayOfMonth}
      setInterval={setInterval}
      setTypeInterval={setIntervalType}
      setDoM={setDayOfMonth}
    />
  );

  return (
    <Collapsable heading={<h1>Add new transaction</h1>}>
      <div className={props.className}>
        <form onSubmit={handleSubmit}>
          <input
            type="radio"
            name="transactionType"
            value="expense"
            checked={transactionType === 'expense'}
            onChange={handleTransactionTypeChange}
          />{' '}
          Expense
          <input
            type="radio"
            name="transactionType"
            value="income"
            onChange={handleTransactionTypeChange}
          />{' '}
          Income
          <Input value={date} id="date" type="date" setState={setDate}>
            Date
          </Input>
          <Input
            value={amount}
            id="amount"
            type="number"
            setState={setAmount}
            placeholder="0.00"
          >
            Amount
          </Input>
          <Input
            value={name}
            id="name"
            type="text"
            setState={setName}
            placeholder="John Doe"
          >
            Name
          </Input>
          <Input
            value={counterpart}
            id="counterpart"
            type="text"
            setState={setCounterpart}
            placeholder="Otter Accessories Inc."
          >
            Counterpart
          </Input>
          <TextArea
            value={notes}
            id="notes"
            setState={setNotes}
            placeholder="Notes regarding the transaction"
          >
            Notes
          </TextArea>
          <Checkbox value={recurring} setState={setRecurring} id="recurring">
            Recurring?
          </Checkbox>
          <br />
          {recurring && recurringTransactionOptions}
          <OutlinedButton type="submit">Add transaction</OutlinedButton>
        </form>
      </div>
    </Collapsable>
  );
};

export default styled(AddTransaction)`
  display: grid;
  grid-template-columns: 50% 50%;
  margin-top: 1em;
  grid-gap: 1em;
  width: calc(100% - 1em);
`;
