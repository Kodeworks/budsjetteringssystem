import moment from 'moment';
import React from 'react';
import { useTransactionState } from '../../store/contexts/transactions';
import Checkbox from '../atoms/Checkbox';
import Input from '../atoms/Input';
import OutlinedButton from '../atoms/OutlinedButton';
import RadioButton from '../atoms/RadioButton';
import RecurringTransactionOptions from '../atoms/RecurringTransactionOptions';
import TextArea from '../atoms/TextArea';

type ITransaction = import('../../declarations/transaction').ITransaction;
type IRecurringTransaction = import('../../declarations/transaction').IRecurringTransaction;
type TransactionType = import('../../declarations/transaction').TransactionType;
type IntervalType = IRecurringTransaction['interval_type'];

interface IEditTransactionProps {
  onSubmit: (tx: ITransaction | IRecurringTransaction) => void;
  tx: import('../../declarations/transaction').ITransaction;
}

const EditTransaction: React.FC<IEditTransactionProps> = props => {
  if (!props.tx.recurring_transaction_id) {
    return <EditRegularTransaction {...props} />;
  }

  return <EditRecurringTransaction {...props} />;
};

const EditRecurringTransaction: React.FC<IEditTransactionProps> = props => {
  const state = useTransactionState();

  const rec = state.recurring.find(
    e => e.id === props.tx.recurring_transaction_id
  )!;

  const [transactionType, setTransactionType] = React.useState<TransactionType>(
    rec.template.type
  );

  const [date, setDate] = React.useState(rec.start_date);
  const [endDate, setEndDate] = React.useState(rec.end_date);
  const [amount, setAmount] = React.useState(rec.template.money / 100);
  const [description, setDescription] = React.useState(
    rec.template.description
  );
  const [notes, setNotes] = React.useState(rec.template.notes || '');
  const [interval, setInterval] = React.useState(rec.interval);
  const [intervalTypeValue, setIntervalType] = React.useState<IntervalType>(
    rec.interval_type
  );

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      props.onSubmit({
        ...rec,
        end_date: endDate,
        interval,
        interval_type: intervalTypeValue,
        start_date: date,
        template: {
          ...rec.template,
          description,
          money: amount * 100,
          type: transactionType,
        },
      });
    } catch (e) {
      /* TODO: handle and display error to the user */
      // tslint:disable-next-line: no-console
      console.error(e.message);
    }
  };

  return (
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
        Start date
      </Input>
      <Input value={endDate} id="end-date" type="date" setState={setEndDate}>
        End date
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
      {recurringTransactionOptions}
      <OutlinedButton type="submit">Edit recurring</OutlinedButton>
    </form>
  );
};

const EditRegularTransaction: React.FC<IEditTransactionProps> = props => {
  const [date, setDate] = React.useState(props.tx.date);
  const [amount, setAmount] = React.useState(props.tx.money / 100);
  const [name, setName] = React.useState(props.tx.description);
  const [notes, setNotes] = React.useState(props.tx.notes || '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    props.onSubmit({
      company_id: props.tx.company_id,
      date,
      description: name,
      id: props.tx.id,
      money: amount,
      notes,
      type: props.tx.type,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <TextArea
        value={notes}
        id="notes"
        setState={setNotes}
        placeholder="Notes regarding the transaction"
      >
        Notes
      </TextArea>
      <OutlinedButton type="submit">Edit transaction</OutlinedButton>
    </form>
  );
};

export default EditTransaction;
