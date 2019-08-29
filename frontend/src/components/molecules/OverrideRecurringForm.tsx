import React from 'react';
import { useTransactionDispatch } from '../../store/contexts/transactions';
import { TransactionActions } from '../../store/reducers/transactions';
import Input from '../atoms/Input';
import OutlinedButton from '../atoms/OutlinedButton';
import TextArea from '../atoms/TextArea';

interface IOverrideRecurringFormProps {
  tx: import('../../declarations/transaction').ITransaction;
}

const OverrideRecurringForm: React.FC<IOverrideRecurringFormProps> = props => {
  const [amount, setAmount] = React.useState(props.tx.money / 100);
  const [description, setDescription] = React.useState(props.tx.description);
  const [notes, setNotes] = React.useState(props.tx.notes || '');

  const dispatch = useTransactionDispatch();

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();

    // TODO: update store to set this new transaction as an override.
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
    <form onSubmit={onSubmit}>
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
      <OutlinedButton type="submit">Create override</OutlinedButton>
    </form>
  );
};

export default OverrideRecurringForm;
