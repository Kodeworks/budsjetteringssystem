import React from 'react';
import { useTransactionDispatch } from '../../store/contexts/transactions';
import { TransactionActions } from '../../store/reducers/transactions';
import Form from './Form';

interface IOverrideRecurringFormProps {
  tx: import('../../declarations/transaction').ITransaction;
}

const OverrideRecurringForm: React.FC<IOverrideRecurringFormProps> = props => {
  const dispatch = useTransactionDispatch();

  const onSubmit = async ({ description, amount, notes }: any) => {
    await TransactionActions.doCreateTransaction(
      {
        ...props.tx,
        description,
        money: amount * 100,
        notes,
      },
      dispatch
    );
  };

  return (
    <Form
      schema={[
        {
          id: 'override-recurring-amount',
          label: 'Amount',
          name: 'amount',
          placeholder: '0.00',
          type: 'number',
          value: props.tx.money / 100,
        },
        {
          id: 'override-recurring-description',
          label: 'Description',
          name: 'description',
          placeholder: 'Christmas Table 2018',
          type: 'text',
          value: props.tx.description,
        },
        {
          id: 'override-recurring-notes',
          label: 'Notes',
          name: 'notes',
          placeholder: 'It seemed like everyone had a good time.',
          type: 'textarea',
          value: props.tx.notes,
        },
      ]}
      onSubmit={onSubmit}
    >
      Create override
    </Form>
  );
};

export default OverrideRecurringForm;
