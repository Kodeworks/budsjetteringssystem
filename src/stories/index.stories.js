import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { createDummyTransaction } from '../helpers/transaction_creator';
import RecurringTransactionOptions from '../components/atoms/RecurringTransactionOptions';
import App from '../App';
import Checkbox from '../components/atoms/Checkbox';
import Filters from '../components/molecules/Filters';
import NavigationBrand from '../components/atoms/NavigationBrand';
import NavigationPill from '../components/atoms/NavigationPill';
import OutlinedButton from '../components/atoms/OutlinedButton';
import TabMenu from '../components/molecules/TabMenu'
import TextArea from '../components/atoms/TextArea';
import CardContainer from '../components/atoms/CardContainer';
import Toolbar from '../components/organism/Toolbar';
import Transactions from '../components/organism/Transactions';
import Select from '../components/atoms/Select';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { navbarWidth } from '../styling/sizes';
import { theme } from '../styling/theme';
import { reducer, initialState, ActionCreators } from '../reducers/transactions';
import { TransactionCtx, createTransactionCtx } from '../contexts/transaction';
import Input from '../components/atoms/Input';
import AddTransaction from '../components/molecules/AddTransaction';
import TransactionEntry from '../components/atoms/TransactionEntry';
import LandingPage from '../components/pages/LandingPage';
import AddButton from '../components/atoms/AddButton';
import Navigation from '../components/organism/Navigation';
import { GlobalStyle } from '../styling/global';

const Wrapper = props => {
  const [store, dispatch] = React.useReducer(reducer, initialState);
  createTransactionCtx(store, dispatch);

  if (store.transactions.length === 0) {
    const txEntries = (new Array(100)).fill(0).map(createDummyTransaction);
    txEntries.forEach(e => dispatch(ActionCreators.addTransaction(e)));
  }

  return (
    <TransactionCtx.Provider value={{store, dispatch}}>
      <>
        <GlobalStyle />
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            {props.children}
          </ThemeProvider>
        </BrowserRouter>
      </>
    </TransactionCtx.Provider>
  )
};

addDecorator(storyFn => (
  <Wrapper>
    {storyFn()}
  </Wrapper>
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
  .add('Normal', () => <AddButton>+</AddButton>);

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

const txEntries = (new Array(100)).fill(1).map(createDummyTransaction);

storiesOf('Dashboard', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgorundColor }}>{fn()}</div>)
  .add('Transactions', () => <Transactions transactions={txEntries} />)
  .add('CardContainer', () => (
  <CardContainer>
    <header>Card</header>
    <p>Lorem ipsum dolor amet waistcoat VHS migas, you probably haven't heard of them gastropub hammock poke. Disrupt you probably haven't heard of them prism, truffaut brunch blue bottle heirloom. Pork belly bicycle rights viral cliche direct trade everyday carry. Try-hard thundercats affogato brunch hella messenger bag 3 wolf moon celiac ramps heirloom DIY palo santo. Church-key salvia pug 8-bit sustainable activated charcoal tattooed direct trade aesthetic narwhal asymmetrical retro food truck paleo keytar.</p>
    </CardContainer>))

storiesOf('Dashboard/Transactions', module)
  .add('Entry (expense)', () => <TransactionEntry {...txEntries[0]} />)
  .add('Entry (income)', () => <TransactionEntry {...txEntries[3]} />)

storiesOf('Transactions', module)
  .addDecorator(fn => <div style={{ width: '80vw', margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('Transaction page', () => <Transactions />)
  .add('Recurring options', () => <RecurringTransactionOptions/>);

storiesOf('Input/Text', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('With placeholder', () => <Input type="text" id="lipsum" placeholder="Welcome to the jungle">Lorem ipsum</Input>)

storiesOf('Input/Date', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('With placeholder', () => <Input type="date" id="lipsum" placeholder="Welcome to the jungle">Lorem ipsum</Input>)

storiesOf('Input/Checkbox', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('Unticked', () => <Checkbox>Lipsum?</Checkbox>)
  .add('Ticked', () => <Checkbox value={true}>Lipsum?</Checkbox>)

storiesOf('Filters', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('With placeholder', () => <Filters setFilter={() => {}} />)

storiesOf('Add new transaction', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('Default', () => <AddTransaction />)

storiesOf('Input/Textarea', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('With placeholder', () => <TextArea placeholder="Insert a funny otter fact.">Welcome to the jungle</TextArea>);

storiesOf('Input/Select', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.backgroundColor }}>{fn()}</div>)
  .add('Default', () => <Select values={[{name: 'Otter', value: 'otter'}, {name: 'Cat', value: 'cat'}, {name: 'Beaver', value: 'beaver'}]}>Select your spirit animal</Select>);
