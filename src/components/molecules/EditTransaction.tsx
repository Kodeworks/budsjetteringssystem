import React from 'react';
import { ITransaction } from '../../declarations/transaction';
import Input from '../atoms/Input';
import OutlinedButton from '../atoms/OutlinedButton';
import TextArea from '../atoms/TextArea';

interface IEditTransactionProps {
  onSubmit: (tx: ITransaction) => void;
  tx: import('../../declarations/transaction').ITransaction;
}

const EditTransaction: React.FC<IEditTransactionProps> = props => {
  const [date, setDate] = React.useState(props.tx.date);
  const [amount, setAmount] = React.useState(props.tx.money);
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
