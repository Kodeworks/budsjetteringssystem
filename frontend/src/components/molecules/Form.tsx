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

  const [fieldErrors, setFieldErrors] = React.useState<{
    [name: string]: Array<{ code: string; detail: string }>;
  }>(freshErrors);

  const [errors, setErrors] = React.useState<
    Array<{ code: string; detail: string }>
  >([]);

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    setFieldErrors(freshErrors);
    setErrors([]);

    try {
      await props.onSubmit(values);
      setValues(freshState);
    } catch (e) {
      // tslint:disable-next-line: no-console
      const errorResp = JSON.parse(e.message) as IError;

      if (errorResp.error_type === 'form_error') {
        Object.entries(errorResp.field_errors).forEach(([field, errs]) => {
          setFieldErrors(er => ({ ...er, [field]: errs }));
        });
      } else if (errorResp.error_type === 'error') {
        setErrors(errorResp.errors);
      }
    }
  };

  /**
   * @summary returns a function which takes a value, and by calling this you set the value of the key with value
   * @param name the key of which to set the value
   */
  const setter = (name: string) => (v: any) =>
    setValues(vs => ({ ...vs, [name]: v }));

  return (
    <div>
      {errors.length > 0 ? (
        <div>
          {errors.map(err => (
            <p key={err.code}>{err.detail}</p>
          ))}
        </div>
      ) : null}
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
            {fieldErrors[e.name].length > 0 ? (
              <div>
                {fieldErrors[e.name].map(err => (
                  <p key={err.code}>{err.detail}</p>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        <Button type="submit">{props.children}</Button>
      </form>
    </div>
  );
};

export default Form;
