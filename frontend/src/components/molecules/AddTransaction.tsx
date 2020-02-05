import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { useAuthState } from '../../store/contexts/auth';
import { useTransactionDispatch } from '../../store/contexts/transactions';
import { TransactionActions } from '../../store/reducers/transactions';
import { snackReducer } from '../../store/reducers/transactions';

import Collapsable from '../atoms/Collapsable';
import SnackBarContainer from '../atoms/SnackBarContainer';
import Form from './Form';

const AddTransaction: React.FC<{ className?: string }> = props => {
  const dispatch = useTransactionDispatch();
  const auth = useAuthState();
  const [store, snackDispatch] = React.useReducer(snackReducer, [] as Array<{
    content: string;
    variant: boolean;
    speed: number;
  }>);

  let delayTimer = setTimeout(null, 0);

  const onButtonClickHandler = (
    content: string,
    speed: number,
    variant: boolean
  ) => {
    snackDispatch({
      payload: { content, speed, variant },
      type: 'REMOVE_SNACK',
    });
    // For some reason the delayTimer ID will be different if it is true or false, which is why it needs to either be +1 or -1 to make sure it gets the right ID.
    if (variant === true) {
      clearTimeout(delayTimer + 1);
    } else {
      clearTimeout(delayTimer - 1);
    }
  };
  const createSnack = (content: string, variant: boolean, speed: number) => {
    snackDispatch({
      payload: { content, speed, variant },
      type: 'ADD_SNACK',
    });
    delayTimer = setTimeout(() => {
      snackDispatch({
        payload: { content, speed, variant },
        type: 'REMOVE_SNACK',
      });
    }, speed);
  };

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
    if (description.length > 140 && notes.length > 140) {
      createSnack(
        'Too many characters in notes or description. Please try again',
        false,
        6000
      );
      return;
    }
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
    createSnack('Transaction added successfully', true, 6000);
  };
  return (
    <Collapsable heading={<h1>Add new transaction</h1>}>
      <div>
        {store[0] && (
          <SnackBarContainer
            content={store[0].content as string}
            good={store[0].variant as boolean}
            snackBarCloseHandler={() =>
              onButtonClickHandler(
                store[0].content,
                store[0].speed,
                store[0].variant
              )
            }
            speed={store[0].speed}
          />
        )}
      </div>
      <div className={props.className}>
        <Form
          schema={[
            {
              id: 'add-transaction-type',
              label: 'Type',
              name: 'type',
              selectValues: [
                { name: 'Income', value: 'IN' },
                { name: 'Expense', value: 'EX' },
              ],
              type: 'select',
              value: 'IN',
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
              min: 1,
              name: 'money',
              placeholder: '1',
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
              min: 1,
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
