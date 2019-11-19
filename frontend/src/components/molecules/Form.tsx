import React from 'react';
import { IError } from '../../mitochondria';
import Button from '../atoms/Button';
import Checkbox from '../atoms/Checkbox';
import Input from '../atoms/Input';
import RadioButton from '../atoms/RadioButton';
import Select from '../atoms/Select';
import TextArea from '../atoms/TextArea';

interface IInput {
  type: string;
  name: string;
  // Because date transforms into start_date
  aliasName?: string;
  id: string;
  label: string | ((values: any) => string);
  value?: string | number;
  selectValues?: Array<{ value: any; name: string }>;
  placeholder?: string;
  visible?: (values: any) => boolean;
}

type IFormSchema = Array<IInput>;

interface IFormProps {
  schema: IFormSchema;
  onSubmit: (values: object) => Promise<void>;
  successCallback?: () => void;
  disrupting?: boolean;
  stateReset?: boolean;
  /**
   * Fields specified here will not be updated by the freshState update. Thus
   * depends on stateReset being true.
   */
  freezeFields?: Array<string>;
}

const FormComponentContainer: React.FC<{ id: string }> = ({ id, children }) => (
  <div id={`form-container-${id}`}>{children}</div>
);

const Form: React.FC<IFormProps> = props => {
  const freshState = React.useMemo<{ [name: string]: any }>(
    () =>
      props.schema.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.name]: curr.value || '',
        }),
        {}
      ),
    [props.schema]
  );

  const [values, setValues] = React.useState<{ [name: string]: any }>(
    freshState
  );

  const freshErrors = React.useMemo(
    () =>
      props.schema.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.name]: [],
        }),
        {}
      ),
    [props.schema]
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
      /**
       * This exists because of forms like register and login, which may redirect the user.
       * Without this, we will run into a memory leak where it will try to perform actions
       * on an unmounted component.
       */
      if (props.disrupting) {
        return await props.onSubmit(values);
      }
      await props.onSubmit(values);

      // If state reset prop is set, refresh values to fresh state.
      if (props.stateReset) {
        if (props.freezeFields) {
          const overrides = Object.fromEntries(
            props.freezeFields.map(f => [f, values[f]])
          );
          setValues({ ...freshState, ...overrides });
        } else {
          setValues(freshState);
        }
      }

      if (props.successCallback) {
        props.successCallback();
      }
    } catch (e) {
      const errorResp = JSON.parse(e.message) as IError;

      if (errorResp.error_type === 'form_error') {
        Object.entries(errorResp.field_errors).forEach(([field, errs]) => {
          setFieldErrors(er => ({ ...er, [field]: errs }));
        });

        if (errorResp.errors.length > 0) {
          setErrors(errorResp.errors);
        }
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

  const renderErrors = (e: IInput) => {
    const name = e.name;

    let errs = fieldErrors[name];
    if (e.aliasName) {
      errs = errs.concat(fieldErrors[e.aliasName] || []);
    }

    return errs.length > 0 ? (
      <div>
        {errs.map(err => (
          <p key={err.code}>{err.detail}</p>
        ))}
      </div>
    ) : null;
  };

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
        {props.schema.map(e => {
          const name = e.name;
          let label = e.label;

          /**
           * If the label passed down is a function, evaulate the function and
           * set the new label name to the return value of the function. If it
           * is a string, simply use that.
           */
          if (typeof label === 'function') {
            label = label(values);
          }

          if (e.visible !== undefined && !e.visible(values)) {
            return null;
          }

          switch (e.type) {
            case 'select':
              return (
                <FormComponentContainer id={e.id} key={e.id}>
                  <Select
                    name={name}
                    values={e.selectValues!}
                    id={e.id}
                    value={values[name]}
                    setState={setter(name)}
                  >
                    {label}
                  </Select>
                  {renderErrors(e)}
                </FormComponentContainer>
              );
            case 'checkbox':
              return (
                <FormComponentContainer id={e.id} key={e.id}>
                  <Checkbox
                    name={name}
                    id={e.id}
                    value={values[name]}
                    setState={setter(name)}
                  >
                    {label}
                  </Checkbox>
                  {renderErrors(e)}
                </FormComponentContainer>
              );
            case 'radio':
              return (
                <FormComponentContainer id={e.id} key={e.id}>
                  <RadioButton
                    name={name}
                    value={e.value}
                    checked={values[name] === e.value}
                    setState={setter(name)}
                  >
                    {label}
                  </RadioButton>
                  {renderErrors(e)}
                </FormComponentContainer>
              );
            case 'textarea':
              return (
                <FormComponentContainer id={e.id} key={e.id}>
                  <TextArea
                    value={values[name]}
                    setState={setter(name)}
                    id={e.id}
                    placeholder={e.placeholder}
                    ariaLabel={name}
                  >
                    {label}
                  </TextArea>
                  {renderErrors(e)}
                </FormComponentContainer>
              );
            default:
              return (
                <FormComponentContainer id={e.id} key={e.id}>
                  <Input
                    value={values[name]}
                    setState={setter(name)}
                    id={e.id}
                    type={e.type}
                    placeholder={e.placeholder}
                    ariaLabel={name}
                  >
                    {label}
                  </Input>
                  {renderErrors(e)}
                </FormComponentContainer>
              );
          }
        })}

        <Button type="submit">{props.children}</Button>
      </form>
    </div>
  );
};

export default Form;
