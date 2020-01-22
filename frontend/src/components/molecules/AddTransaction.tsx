import moment from 'moment';
import React, { useReducer, ReactElement } from 'react';
import styled from 'styled-components';
import { useAuthState } from '../../store/contexts/auth';
import { useTransactionDispatch } from '../../store/contexts/transactions';
import { TransactionActions } from '../../store/reducers/transactions';
import Collapsable from '../atoms/Collapsable';
import Form from './Form';
import SnackBarContainer from '../atoms/SnackBarContainer';

const initialState = { snax: <div></div>, content: '' };

type stateType = {
  snax: ReactElement;
  content: string;
};

type ActionType = {
  type: 'clear' | 'good' | 'bad';
};

const reducer = (state: stateType, action: ActionType): stateType => {
  switch (action.type) {
    case 'clear':
      return initialState;
    case 'good':
      return {
        snax: <SnackBarContainer good={true} content={state.content} />,
        content: state.content,
      };
    case 'bad':
      return {
        snax: <SnackBarContainer good={false} content={state.content} />,
        content: state.content,
      };
    default:
      return initialState;
  }
};

const AddTransaction: React.FC<{ className?: string }> = props => {
  const dispatch = useTransactionDispatch();
  const auth = useAuthState();
  const [state, snaxDispatch] = useReducer(reducer, {
    snax: <div></div>,
    content: '',
  });

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
    if (!(description.length > 140) && !(notes.length > 140)) {
      state.content = 'Transaction added successfully';
      snaxDispatch({ type: 'good' });
      setTimeout(() => snaxDispatch({ type: 'clear' }), 6000);
      console.log(state.snax);
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
    } else {
      state.content = 'Too many characters.';
      snaxDispatch({ type: 'bad' });
      setTimeout(() => snaxDispatch({ type: 'clear' }), 6000);
    }
  };
  return (
    <Collapsable heading={<h1>Add new transaction</h1>}>
      <div>{state.snax}</div>
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
