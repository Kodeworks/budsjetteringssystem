import React from 'react';

import { useAuth } from '../../../store/contexts/auth';
import { useCompanyDispatch } from '../../../store/contexts/company';
import { AuthActions } from '../../../store/reducers/auth';
import { CompanyActions } from '../../../store/reducers/company';
import AccentedLink from '../../atoms/AccentedLink';
import AuthenticationCard from '../../molecules/Card';
import Form from '../../molecules/Form';

const CreateCompany: React.FC<
  import('react-router').RouteComponentProps<{}>
> = props => {
  const [auth, authDispatch] = useAuth();
  const companyDispatch = useCompanyDispatch();

  const onSubmit = async (values: any) => {
    await CompanyActions.doCreateCompany(values, companyDispatch);
    await AuthActions.doSetUser(auth!.id, authDispatch);
    props.history.push('/');
  };

  const onLogout = () => AuthActions.doLogout(authDispatch);

  return (
    <AuthenticationCard>
      <h1 data-testid="authform-header">Create company</h1>

      <Form
        disrupting={true}
        schema={[
          {
            id: 'create-company-name',
            label: 'company name',
            name: 'name',
            placeholder: 'Google Inc.',
            type: 'text',
          },
          {
            id: 'create-company-org_nr',
            label: 'organization number',
            min: 0,
            name: 'org_nr',
            placeholder: '01189998819991197253',
            type: 'number',
          },
        ]}
        onSubmit={onSubmit}
        stateReset={true}
      >
        Create company
      </Form>

      <AccentedLink to="/login" onClick={onLogout}>
        Log in to another account
      </AccentedLink>
    </AuthenticationCard>
  );
};

export default CreateCompany;
