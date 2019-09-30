import React from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

/**
 * What do we need in a form
 *
 * onSubmit which takes { name: value }
 * schema with relevant info
 * - checkbox
 * - text/number
 * - date
 * - radio
 */

interface IInput {
  type: string;
  name: string;
  id: string;
  label: string;
  value?: string | number;
  placeholder?: string;
}

type IFormSchema = Array<IInput>;

interface IFormProps {
  schema: IFormSchema;
  onSubmit: (values: object) => Promise<void>;
}

const Form: React.FC<IFormProps> = props => {
  const freshState = React.useMemo(() => 
    props.schema.reduce(
      (prev, curr) => ({ ...prev, [curr.name]: curr.value || '' }),
      {}
    )
  , [props.schema])

  const [values, setValues] = React.useState<{ [name: string]: any }>(
    freshState
  );

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();

    try {
      await props.onSubmit(values);
      setValues(freshState);
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  };

  /**
   * @summary returns a function which takes a value, and by calling this you set the value of the key with value
   * @param name the key of which to set the value
   */
  const setter = (name: string) => (v: any) =>
    setValues(vs => ({ ...vs, [name]: v }));

  return (
    <form onSubmit={onSubmit}>
      {props.schema.map(e => (
        <Input
          value={values[e.name]}
          setState={setter(e.name)}
          key={e.id}
          id={e.id}
          type={e.type}
          placeholder={e.placeholder}
        >
          {e.label}
        </Input>
      ))}

      <Button type="submit">{props.children}</Button>
    </form>
  );
};

export default Form;
