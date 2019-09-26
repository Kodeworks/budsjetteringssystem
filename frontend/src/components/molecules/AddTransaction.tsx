import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { useAuthState } from '../../store/contexts/auth';
import { useTransactionDispatch } from '../../store/contexts/transactions';
import { TransactionActions } from '../../store/reducers/transactions';
import Checkbox from '../atoms/Checkbox';
import Collapsable from '../atoms/Collapsable';
import Input from '../atoms/Input';
import OutlinedButton from '../atoms/OutlinedButton';
import RadioButton from '../atoms/RadioButton';
import RecurringTransactionOptions, {
  IntervalType,
} from '../atoms/RecurringTransactionOptions';
import TextArea from '../atoms/TextArea';

type TransactionType = import('../../declarations/transaction').TransactionType;

const AddTransaction: React.FC<{ className?: string }> = props => {
  const dispatch = useTransactionDispatch();
  const auth = useAuthState();

  const [transactionType, setTransactionType] = React.useState<TransactionType>(
    'EX'
  );

  const [date, setDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = React.useState(
    moment()
      .add(1, 'year')
      .format('YYYY-MM-DD')
  );
  const [amount, setAmount] = React.useState();
  const [description, setDescription] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [recurring, setRecurring] = React.useState(false);
  const [interval, setInterval] = React.useState(1);
  const [intervalTypeValue, setIntervalType] = React.useState<IntervalType>(
    'MO'
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!recurring) {
        await TransactionActions.doCreateTransaction(
          {
            company_id: auth!.selectedCompany!,
            date,
            description,
            money: amount || 0 * 100,
            notes,
            type: transactionType,
          },
          dispatch
        );
      } else {
        await TransactionActions.doCreateRecurringTransaction(
          {
            company_id: auth!.selectedCompany!,
            end_date: endDate,
            interval,
            interval_type: intervalTypeValue,
            start_date: date,
            template: {
              description,
              money: amount || 0 * 100,
              type: transactionType,
            },
          },
          dispatch
        );
      }
    } catch (e) {
      /* TODO: handle and display error to the user */
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  };

  const handleTransactionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransactionType({ income: 'IN', expense: 'EX' }[
      event.target.value as 'income' | 'expense'
    ] as TransactionType);
  };

  const recurringTransactionOptions = (
    <RecurringTransactionOptions
      intervalValue={interval}
      intervalTypeValue={intervalTypeValue}
      setInterval={setInterval}
      setTypeInterval={setIntervalType}
    />
  );

  return (
    <Collapsable heading={<h1>Add new transaction</h1>}>
      <div className={props.className}>
        <form onSubmit={handleSubmit}>
          <RadioButton
            name="transactionType"
            value="expense"
            checked={transactionType === 'EX'}
            handler={handleTransactionTypeChange}
          >
            Expense
          </RadioButton>
          <RadioButton
            name="transactionType"
            value="income"
            checked={transactionType === 'IN'}
            handler={handleTransactionTypeChange}
          >
            Income
          </RadioButton>
          <Input value={date} id="date" type="date" setState={setDate}>
            {recurring ? 'Start date' : 'Date'}
          </Input>
          {recurring && (
            <Input
              value={endDate}
              id="end-date"
              type="date"
              setState={setEndDate}
            >
              End date
            </Input>
          )}
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
            value={description}
            id="description"
            type="text"
            setState={setDescription}
            placeholder="Kakefestballong"
          >
            Description
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
  form {
    grid-gap: 1em;
    display: grid;
    grid-template-columns: 50% 50%;
  }

  margin-top: 1em;
  width: calc(100% - 1em);
`;
