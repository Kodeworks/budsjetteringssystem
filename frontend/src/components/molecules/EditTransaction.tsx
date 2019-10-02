import moment from 'moment';
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
  toggleMore: () => void;
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

  const onSubmit = async ({
    date,
    description,
    end_date,
    interval,
    interval_type,
    money,
    notes,
  }: any) => {
    await TransactionActions.doUpdateRecurringTransaction(
      {
        ...rec,
        end_date,
        interval,
        interval_type,
        start_date: date,
        template: {
          ...rec.template,
          description,
          money: money * 100,
          notes,
          type: rec.template.type,
        },
      },
      dispatch
    );
  };

  return (
    <Form
      successCallback={props.toggleMore}
      schema={[
        {
          aliasName: 'start_date',
          id: 'add-transaction-date',
          label: 'Date',
          name: 'date',
          type: 'date',
          value: rec.start_date,
        },
        {
          id: 'add-transaction-end-date',
          label: 'End date',
          name: 'end_date',
          type: 'date',
          value: rec.end_date,
        },
        {
          id: 'add-transaction-amount',
          label: 'Amount',
          name: 'money',
          placeholder: '0.00',
          type: 'number',
          value: rec.template.money / 100,
        },
        {
          id: 'add-transaction-description',
          label: 'Description',
          name: 'description',
          placeholder: rec.template.description,
          type: 'text',
          value: rec.template.description,
        },
        {
          id: 'add-transaction-notes',
          label: 'Notes',
          name: 'notes',
          placeholder: 'Relevant info about transaction',
          type: 'textarea',
          value: rec.template.notes,
        },
        {
          id: 'add-transaction-interval-count',
          label: 'Interval period',
          name: 'interval',
          placeholder: `${rec.interval}`,
          type: 'number',
          value: rec.interval,
        },
        {
          id: 'add-transaction-interval-type',
          label: 'Interval type',
          name: 'interval_type',
          selectValues: [
            { name: 'Day', value: 'DA' },
            { name: 'Month', value: 'MO' },
          ],
          type: 'select',
          value: rec.interval_type,
        },
      ]}
      onSubmit={onSubmit}
    >
      Update transaction
    </Form>
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
      successCallback={props.toggleMore}
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
