import React from 'react';
import {
  useTransactionDispatch,
  useTransactions,
} from '../../store/contexts/transactions';
import { TransactionActions } from '../../store/reducers/transactions';
import Input from '../atoms/Input';
import OutlinedButton from '../atoms/OutlinedButton';
import RadioButton from '../atoms/RadioButton';
import RecurringTransactionOptions from '../atoms/RecurringTransactionOptions';
import TextArea from '../atoms/TextArea';
import Form from './Form';

type IRecurringTransaction = import('../../declarations/transaction').IRecurringTransaction;
type TransactionType = import('../../declarations/transaction').TransactionType;
type IntervalType = IRecurringTransaction['interval_type'];

interface IEditTransactionProps {
  tx: import('../../declarations/transaction').ITransaction;
  isOverride: boolean;
}

const EditTransaction: React.FC<IEditTransactionProps> = props => {
  if (!props.tx.recurring_transaction_id || props.isOverride) {
    return <EditRegularTransaction {...props} />;
  }

  return <EditRecurringTransaction {...props} />;
};

const EditRecurringTransaction: React.FC<IEditTransactionProps> = props => {
  const [state, dispatch] = useTransactions();

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

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    await TransactionActions.doUpdateRecurringTransaction(
      {
        ...rec,
        end_date: endDate,
        interval,
        interval_type: intervalTypeValue,
        start_date: date,
        template: {
          ...rec.template,
          description,
          money: amount * 100,
          notes,
          type: transactionType,
        },
      },
      dispatch
    );
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
    <form onSubmit={onSubmit}>
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
  const dispatch = useTransactionDispatch();

  const onSubmit = async ({ date, description, amount, notes }: any) => {
    await TransactionActions.doUpdateTransaction(
      {
        company_id: props.tx.company_id,
        date,
        description,
        id: props.tx.id,
        money: amount * 100,
        notes,
        recurring_transaction_id: props.tx.recurring_transaction_id,
        type: props.tx.type,
      },
      dispatch
    );
  };

  return (
    <Form
      schema={[
        {
          id: 'edit-regular-date',
          label: 'Date',
          name: 'date',
          type: 'date',
          value: props.tx.date,
        },
        {
          id: 'edit-regular-description',
          label: 'Description',
          name: 'description',
          type: 'text',
          value: props.tx.description,
        },
        {
          id: 'edit-regular-amount',
          label: 'Amount',
          name: 'amount',
          type: 'number',
          value: props.tx.money / 100,
        },
        {
          id: 'edit-regular-notes',
          label: 'Notes',
          name: 'notes',
          placeholder: 'Relevant info about transaction',
          type: 'textarea',
          value: props.tx.notes,
        },
      ]}
      onSubmit={onSubmit}
    >
      Edit transaction
    </Form>
  );
};

export default EditTransaction;
