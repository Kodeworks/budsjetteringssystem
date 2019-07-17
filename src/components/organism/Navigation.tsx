import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { navbarWidth } from '../../styling/sizes';
import NavigationBrand from '../atoms/NavigationBrand';
import NavigationPill from '../atoms/NavigationPill';
import NavigationSeparator from '../atoms/NavigationSeparator';

interface IProps {
  className?: string;
}

const links: Array<{ to: string; name: string }> = [
  { to: '', name: 'Dashboard' },
  { to: 'transactions', name: 'Transactions' },
  { to: 'balances', name: 'Balances' },
  { to: 'faq', name: 'FAQ' },
];

const Navigation: React.FC<IProps & RouteComponentProps> = ({
  className,
  location: { pathname },
}) => (
  <nav className={className}>
    <NavigationBrand />
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
