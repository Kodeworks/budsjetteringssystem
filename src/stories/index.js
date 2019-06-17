import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';

import App from '../App';
import Navigation from '../components/molecules/Navigation';
import { navbarWidth } from '../styling/sizes';
import { GlobalStyle } from '../styling/global';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styling/theme';
import NavigationBrand from '../components/molecules/atoms/NavigationBrand';
import NavigationPill from '../components/molecules/atoms/NavigationPill';
import Toolbar from '../components/molecules/Toolbar';
import AddButton from '../components/molecules/atoms/AddButton';
import OutlinedButton from '../components/molecules/atoms/OutlinedButton';
import LandingPage from '../components/LandingPage';
import TabMenu from '../components/molecules/TabMenu'
import DashboardTransactions from '../components/molecules/DashboardTransactions';
import DashboardTransactionEntry from '../components/molecules/atoms/DashboardTransactionEntry';

addDecorator(storyFn => (
  <>
    <GlobalStyle />
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {storyFn()}
      </ThemeProvider>
    </BrowserRouter>
  </>
));


storiesOf('Navigation', module)
  .add('Full', () => (
    <Navigation />
  ))
  .add('Brand', () => (
    <div style={{ width: navbarWidth, background: theme.main, display: 'flex', flexDirection: "column", paddingBottom: '1em' }}>
      <NavigationBrand />
    </div>
  ));

storiesOf('Navigation/Pill', module)
  .addDecorator(fn => <div style={{ width: navbarWidth, padding: '1em', background: theme.accent1 }}>{fn()}</div>)
  .add('Inactive', () => <NavigationPill to="/" active={false}>Inactive</NavigationPill>)
  .add('Active', () => <NavigationPill to="/" active={true}>Active</NavigationPill>);

storiesOf('App', module)
  .add('Full', () => <App />);

storiesOf('Toolbar', module)
  .add('Default', () => <Toolbar />);

storiesOf('Button/Add', module)
  .add('Normal', () => <AddButton />);

storiesOf('Button/Outlined', module)
  .add('Normal', () => <OutlinedButton>Lipsum</OutlinedButton>);

storiesOf('LandingPage', module)
  .add('Full', () => <LandingPage />);

const tabs = [
  'Tab 1',
  'Tab 2',
  'Tab 3',
];

storiesOf('Page', module)
  .add('Tabs', () => <TabMenu tabLabels={tabs} />)

const txEntries = [
  { id: 0, name: 'Cute Otter Pictures', money: 25089, type: 'Expense', date: '23.08.1999' },
  { id: 1, name: 'Weird Gerbils', money: 120308, type: 'Expense', date: '23.08.1999' },
  { id: 2, name: 'Cats with hats', money: 6516813, type: 'Expense', date: '23.08.1999' },
  { id: 3, name: 'Constructive Criticism', money: 2105089, type: 'Income', date: '26.09.1993' },
  { id: 4, name: 'Cute Otter Pictures', money: 616823, type: 'Expense', date: '23.08.1999' },
]

storiesOf('Dashboard', module)
  .addDecorator(fn => <div style={{ width: '30vw', margin: '2em' }}>{fn()}</div>)
  .add('Transactions', () => <DashboardTransactions transactions={txEntries} />)

storiesOf('Dashboard/Transactions', module)
  .add('Entry (expense)', () => <DashboardTransactionEntry {...txEntries[0]} />)
  .add('Entry (income)', () => <DashboardTransactionEntry {...txEntries[3]} />)