import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthState } from '../../store/contexts/auth';
import { navbarWidth } from '../../styling/sizes';
import NavigationBrand from '../atoms/NavigationBrand';
import NavigationPill from '../atoms/NavigationPill';
import NavigationSeparator from '../atoms/NavigationSeparator';

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
  const auth = useAuthState();

  return (
    <nav className={className}>
      <NavigationBrand />
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
