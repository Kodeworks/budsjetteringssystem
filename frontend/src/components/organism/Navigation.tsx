import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../store/contexts/auth';
import { useCompanyState } from '../../store/contexts/company';
import { AuthActions } from '../../store/reducers/auth';
import { navbarWidth } from '../../styling/sizes';
import NavigationBrand from '../atoms/NavigationBrand';
import NavigationPill from '../atoms/NavigationPill';
import NavigationSeparator from '../atoms/NavigationSeparator';
import Select from '../atoms/Select';

const links: Array<{ to: string; name: string }> = [
  { to: '', name: 'Dashboard' },
  { to: 'transactions', name: 'Transactions' },
  { to: 'projections', name: 'Projections' },
  // { to: 'balances', name: 'Balances' },
  // { to: 'faq', name: 'FAQ' },
  { to: 'companies', name: 'Companies' },
];

const Navigation: React.FC<{ className?: string } & RouteComponentProps> = ({
  className,
  location: { pathname },
}) => {
  const [auth, authDispatch] = useAuth();
  const companies = useCompanyState();

  const setActiveCompany = (id: string) => {
    AuthActions.doSetActiveCompany(Number(id), authDispatch);
  };

  const [companyOptions, setCompanyOptions] = React.useState<
    Array<{ name: string; value: number }>
  >(
    auth!.companies.map(e => ({
      name: 'Loading company...',
      value: e.company_id,
    }))
  );

  /**
   * This is used for rendering and providing values to the select which allows the user
   * to select a company.
   */
  React.useEffect(() => {
    auth!.companies.forEach(c => {
      /**
       * x Check if new company in auth is in previous setState object
       * - Check if we can retrieve the name from the newly generated company variable
       * - Update the name if we can, and if not, just leave it
       */
      if (!companyOptions.find(e => e.value === c.company_id)) {
        setCompanyOptions(prevState => [
          ...prevState,
          { name: 'Loading company...', value: c.company_id },
        ]);
      }

      const company = companies.find(e => e.id === c.company_id);

      if (!company) {
        return;
      }

      setCompanyOptions(
        companyOptions.map(e => ({ ...e, name: company.name }))
      );
    });
  }, [auth, companies, companyOptions]);

  return (
    <nav className={className}>
      <NavigationBrand />
      <NavigationSeparator />
      <div className="company-selector">
        <Select
          values={companyOptions}
          value={auth!.selectedCompany}
          setState={setActiveCompany}
        />
      </div>
      <NavigationSeparator />
      <div>
        {links.map(l => (
          <NavigationPill key={l.to} to={l.to} active={pathname === `/${l.to}`}>
            {l.name}
          </NavigationPill>
        ))}
      </div>
      <NavigationSeparator style={{ marginTop: 'auto' }} />
    </nav>
  );
};

export default styled(withRouter(Navigation))`
  width: ${navbarWidth};
  height: 100vh;

  background: ${props => props.theme.palette.secondary.main};

  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .company-selector {
    margin: 0 0.5em;
  }
`;
