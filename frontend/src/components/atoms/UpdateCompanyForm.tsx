import React from 'react';
import { useCompanyDispatch } from '../../store/contexts/company';
import { CompanyActions } from '../../store/reducers/company';
import Input from './Input';

interface IUpdateCompanyFormProps {
  company: Omit<import('../../declarations/company').ICompany, 'users'>;
}

const UpdateCompanyForm: React.FC<IUpdateCompanyFormProps> = ({ company }) => {
  const [name, setName] = React.useState(company.name); // fill in
  const [orgNr, setOrgNr] = React.useState(company.org_nr); // fill in

  const companyDispatch = useCompanyDispatch();

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    await CompanyActions.doUpdateCompany(
      { name, company_id: company.id, org_nr: orgNr },
      companyDispatch
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <Input value={name} setState={setName} type="text" id="name">
        Name
      </Input>
      <Input value={orgNr} setState={setOrgNr} type="text" id="org_nr">
        Org. nr
      </Input>
      <input type="submit" value="Save company" />
    </form>
  );
};

export default UpdateCompanyForm;
