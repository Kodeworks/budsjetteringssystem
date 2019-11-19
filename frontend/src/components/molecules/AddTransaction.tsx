import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { useAuthState } from '../../store/contexts/auth';
import { useTransactionDispatch } from '../../store/contexts/transactions';
import { TransactionActions } from '../../store/reducers/transactions';
import Collapsable from '../atoms/Collapsable';
import Form from './Form';

const AddTransaction: React.FC<{ className?: string }> = props => {
  const dispatch = useTransactionDispatch();
  const auth = useAuthState();

  const onSubmit = async ({
    recurring,
    money,
    type,
    description,
    notes,
    date,
    end_date,
    interval_type,
    interval,
  }: any) => {
    if (!recurring) {
      await TransactionActions.doCreateTransaction(
        {
          company_id: auth!.selectedCompany!,
          date,
          description,
          money: money * 100,
          notes,
          type,
        },
        dispatch
      );
    } else {
      await TransactionActions.doCreateRecurringTransaction(
        {
          company_id: auth!.selectedCompany!,
          end_date,
          interval,
          interval_type,
          start_date: date,
          template: {
            description,
            money: money * 100,
            type,
          },
        },
        dispatch
      );
    }
  };

  return (
    <Collapsable heading={<h1>Add new transaction</h1>}>
      <div className={props.className}>
        <Form
          schema={[
            {
              id: 'add-transaction-income',
              label: 'Income',
              name: 'type',
              type: 'radio',
              value: 'IN',
            },
            {
              id: 'add-transaction-expense',
              label: 'Expense',
              name: 'type',
              type: 'radio',
              value: 'EX',
            },
            {
              aliasName: 'start_date',
              id: 'add-transaction-date',
              label: values => (values.recurring ? 'Start date' : 'Date'),
              name: 'date',
              type: 'date',
              value: moment().format('YYYY-MM-DD'),
            },
            {
              id: 'add-transaction-end-date',
              label: 'End date',
              name: 'end_date',
              type: 'date',
              value: moment()
                .add(2, 'years')
                .format('YYYY-MM-DD'),
              visible: values => values.recurring,
            },
            {
              id: 'add-transaction-amount',
              label: 'Amount',
              name: 'money',
              placeholder: '0.00',
              type: 'number',
            },
            {
              id: 'add-transaction-description',
              label: 'Description',
              name: 'description',
              placeholder: 'Birthday Party for React.js',
              type: 'text',
            },
            {
              id: 'add-transaction-notes',
              label: 'Notes',
              name: 'notes',
              placeholder: 'Relevant info about transaction',
              type: 'textarea',
            },
            {
              id: 'add-transaction-recurring',
              label: 'Recurring',
              name: 'recurring',
              type: 'checkbox',
            },
            {
              id: 'add-transaction-interval-count',
              label: 'Interval period',
              name: 'interval',
              placeholder: '3',
              type: 'number',
              visible: values => values.recurring,
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
              value: 'MO',
              visible: values => values.recurring,
            },
          ]}
          onSubmit={onSubmit}
          stateReset={true}
          freezeFields={[
            'type',
            'date',
            'recurring',
            'end_date',
            'interval',
            'interval_type',
          ]}
        >
          Create new transaction
        </Form>
      </div>
    </Collapsable>
  );
};

export default styled(AddTransaction)`
  form {
    grid-gap: 1em;
    display: grid;
    grid-template-columns: 50% 50%;

    button[type='submit'] {
      grid-column: 1 / span 2;
    }

    #form-container-add-transaction-recurring {
      grid-column: 1 / span 2;
    }
  }

  margin-top: 1em;
  width: calc(100% - 1em);
`;
