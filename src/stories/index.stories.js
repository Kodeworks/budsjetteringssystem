import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';

import AddButton from '../components/atoms/AddButton';
import App from '../App';
import Checkbox from '../components/atoms/Checkbox';
import DashboardTransactionEntry from '../components/atoms/DashboardTransactionEntry';
import DashboardTransactions from '../components/molecules/DashboardTransactions';
import Filters from '../components/molecules/Filters';
import LandingPage from '../components/pages/LandingPage';
import Navigation from '../components/organism/Navigation';
import NavigationBrand from '../components/atoms/NavigationBrand';
import NavigationPill from '../components/atoms/NavigationPill';
import OutlinedButton from '../components/atoms/OutlinedButton';
import TabMenu from '../components/molecules/TabMenu'
import CardContainer from '../components/atoms/CardContainer';
import Input from '../components/atoms/Input';
import Toolbar from '../components/organism/Toolbar';
import Transactions from '../components/organism/Transactions';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyle } from '../styling/global';
import { ThemeProvider } from 'styled-components';
import { navbarWidth } from '../styling/sizes';
import { theme } from '../styling/theme';

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
  { id: 0, name: 'Cute Otter Pictures', money: 25089, type: 'Expense', date: '23.08.1999', companyId: 12 },
  { id: 1, name: 'Weird Gerbils', money: 120308, type: 'Expense', date: '23.08.1999' },
  { id: 2, name: 'Cats with hats', money: 6516813, type: 'Expense', date: '23.08.1999' },
  { id: 3, name: 'Constructive Criticism', money: 2105089, type: 'Income', date: '26.09.1993' },
  {
    id: 4, name: 'Cute Otter Pictures', money: 616823, type: 'Expense',
    date: '23.08.1999', notes: 'Otters are the supreme animals. All other animals are to be ignored.'
  },
]

storiesOf('Dashboard', module)
  .addDecorator(fn => <div style={{ width: '30vw', margin: '2em', background: theme.backgorundColor }}>{fn()}</div>)
  .add('Transactions', () => <DashboardTransactions transactions={txEntries} />)
  .add('CardContainer', () => (
  <CardContainer>
    <header>Card</header>
    <p>Lorem ipsum dolor amet waistcoat VHS migas, you probably haven't heard of them gastropub hammock poke. Disrupt you probably haven't heard of them prism, truffaut brunch blue bottle heirloom. Pork belly bicycle rights viral cliche direct trade everyday carry. Try-hard thundercats affogato brunch hella messenger bag 3 wolf moon celiac ramps heirloom DIY palo santo. Church-key salvia pug 8-bit sustainable activated charcoal tattooed direct trade aesthetic narwhal asymmetrical retro food truck paleo keytar.</p>
    </CardContainer>))

storiesOf('Dashboard/Transactions', module)
  .add('Entry (expense)', () => <DashboardTransactionEntry {...txEntries[0]} />)
  .add('Entry (income)', () => <DashboardTransactionEntry {...txEntries[3]} />)

storiesOf('Transactions', module)
  .addDecorator(fn => <div style={{ width: '30vw', margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('Transaction page', () => <Transactions />);

storiesOf('Input/Text', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('With placeholder', () => <Input type="text" id="lipsum" placeholder="Welcome to the jungle">Lorem ipsum</Input>)

storiesOf('Input/Date', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('With placeholder', () => <Input type="date" id="lipsum" placeholder="Welcome to the jungle">Lorem ipsum</Input>)

storiesOf('Input/Checkbox', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('Default', () => <Checkbox id="lipsum">Lipsum?</Checkbox>)

storiesOf('Filters', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('With placeholder', () => <Filters />)
