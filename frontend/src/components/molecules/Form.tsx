import React from 'react';
import { IError } from '../../mitochondria';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

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
  const freshState = React.useMemo(
    () =>
      props.schema.reduce(
        (prev, curr) => ({ ...prev, [curr.name]: curr.value || '' }),
        {}
      ),
    [props.schema]
  );

  const freshErrors = React.useMemo(
    () =>
      props.schema.reduce((prev, curr) => ({ ...prev, [curr.name]: [] }), {}),
    [props.schema]
  );

  const [values, setValues] = React.useState<{ [name: string]: any }>(
    freshState
  );

  const [errors, setErrors] = React.useState<{ [name: string]: Array<string> }>(
    freshErrors
  );

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    setErrors(freshErrors);

    try {
      await props.onSubmit(values);
      setValues(freshState);
    } catch (e) {
      // tslint:disable-next-line: no-console
      const errorResp = JSON.parse(e.message) as IError;

      if (errorResp.error_type !== 'form_error') {
        throw e;
      }

      Object.entries(errorResp.field_errors).forEach(([field, errs]) => {
        setErrors(er => ({ ...er, [field]: errs.map(x => x.detail) }));
      });
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
        <div key={e.id}>
          <Input
            value={values[e.name]}
            setState={setter(e.name)}
            id={e.id}
            type={e.type}
            placeholder={e.placeholder}
          >
            {e.label}
          </Input>
          {errors[e.name].length ? <p>{errors[e.name].join(' ')}</p> : null}
        </div>
      ))}

      <Button type="submit">{props.children}</Button>
    </form>
  );
};

export default Form;
