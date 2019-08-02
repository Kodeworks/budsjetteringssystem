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
  { to: 'balances', name: 'Balances' },
  { to: 'faq', name: 'FAQ' },
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

  /**
   * This is used for rendering and providing values to the select which allows the user
   * to select a company.
   */
  const options = auth!.companies.map(c => {
    const company = companies.find(e => e.id === c.company_id);

    return {
      // It might not be there yet, as we're loading this async in contexts/company
      name: company
        ? company.name
        : `Loading company with ID ${c.company_id}...`,
      value: c.company_id,
    };
  });

  return (
    <nav className={className}>
      <NavigationBrand />
      <NavigationSeparator />
      <Select
        values={options}
        value={auth!.selectedCompany}
        setState={setActiveCompany}
      />
      <NavigationSeparator />
      <div>
        {auth!.companies.length === 0 && (
          <NavigationPill
            key="create-company"
            to="/create-company"
            active={pathname === '/create-company'}
          >
            <strong>Create a company</strong>
          </NavigationPill>
        )}
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
  /* Positioning and size */
  width: ${navbarWidth};
  height: 100vh;

  /* Colors */
  background: ${props => props.theme.palette.secondary.main};

  /* Content management */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;
