import { addDecorator, storiesOf } from '@storybook/react';
import React from 'react';
import App from '../App';
import Checkbox from '../components/atoms/Checkbox';
import Input from '../components/atoms/Input';
import NavigationBrand from '../components/atoms/NavigationBrand';
import NavigationPill from '../components/atoms/NavigationPill';
import OutlinedButton from '../components/atoms/OutlinedButton';
import RecurringTransactionOptions, {
  IntervalType,
} from '../components/atoms/RecurringTransactionOptions';
import SnackBarContainer from '../components/atoms/SnackBarContainer';
import Select from '../components/atoms/Select';
import TextArea from '../components/atoms/TextArea';
import TransactionEntry from '../components/atoms/TransactionEntry';
import AddTransaction from '../components/molecules/AddTransaction';
import Card from '../components/molecules/Card';
import Filters from '../components/molecules/Filters';
import Tab from '../components/molecules/Tab';
import TabsContainer from '../components/molecules/TabsContainer';
import Navigation from '../components/organism/Navigation';
import Toolbar from '../components/organism/Toolbar';
import Transactions from '../components/organism/Transactions';
import LandingPage from '../components/pages/LandingPage';
import { ITransaction } from '../declarations/transaction';
import GlobalWrapper from '../helpers/GlobalWrapper';
import { navbarWidth } from '../styling/sizes';
import { theme } from '../styling/theme';

addDecorator(storyFn => <GlobalWrapper>{storyFn()}</GlobalWrapper>);

const navStyle = {
  background: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '1em',
  width: navbarWidth,
} as React.CSSProperties;

storiesOf('Navigation', module)
  .add('Full', () => <Navigation />)
  .add('Brand', () => (
    <div style={navStyle}>
      <NavigationBrand />
    </div>
  ));

storiesOf('Navigation/Pill', module)
  .addDecorator(fn => (
    <div
      style={{
        background: theme.palette.primary.main,
        padding: '1em',
        width: navbarWidth,
      }}
    >
      {fn()}
    </div>
  ))
  .add('Inactive', () => (
    <NavigationPill to="/" active={false}>
      Inactive
    </NavigationPill>
  ))
  .add('Active', () => (
    <NavigationPill to="/" active={true}>
      Active
    </NavigationPill>
  ));

storiesOf('App', module).add('Full', () => <App />);

storiesOf('Toolbar', module).add('Default', () => <Toolbar />);

storiesOf('Button/Outlined', module).add('Normal', () => (
  <OutlinedButton>Lipsum</OutlinedButton>
));

storiesOf('LandingPage', module).add('Full', () => <LandingPage />);

storiesOf('Card', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('default', () => (
    <Card>
      <header>Card</header>
      <p>
        Lorem ipsum dolor amet waistcoat VHS migas, you probably haven't heard
        of them gastropub hammock poke. Disrupt you probably haven't heard of
        them prism, truffaut brunch blue bottle heirloom. Pork belly bicycle
        rights viral cliche direct trade everyday carry. Try-hard thundercats
        affogato brunch hella messenger bag 3 wolf moon celiac ramps heirloom
        DIY palo santo. Church-key salvia pug 8-bit sustainable activated
        charcoal tattooed direct trade aesthetic narwhal asymmetrical retro food
        truck paleo keytar.
      </p>
    </Card>
  ));

storiesOf('Dashboard', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('Transactions', () => <Transactions />)
  .add('TabsContainer', () => (
    <TabsContainer>
      <Tab label="Minimum liquidity">
        <h2>Projected Minimum Liquidity</h2>
      </Tab>
      <Tab label="Transaction volumes">
        <h2>Transaction Volumes</h2>
      </Tab>
    </TabsContainer>
  ));

const expenseTx = {
  company_id: 1337,
  date: '2019-12-16',
  description: 'Storybook expense',
  id: 1,
  money: 12345,
  notes: 'Storybook is neat!',
  recurring_transaction_id: 666,
  type: 'EX',
} as ITransaction;

const incomeTx = {
  company_id: 1337,
  date: '2019-12-16',
  description: 'Storybook expense',
  id: 1,
  money: 12345,
  notes: 'Storybook is neat!',
  recurring_transaction_id: 666,
  type: 'IN',
} as ITransaction;

storiesOf('Dashboard/Transactions', module)
  .add('Entry (expense)', () => <TransactionEntry {...expenseTx} />)
  .add('Entry (income)', () => <TransactionEntry {...incomeTx} />);

storiesOf('Transactions', module)
  .addDecorator(fn => (
    <div
      style={{
        background: theme.palette.primary.main,
        margin: '2em',
        width: '80vw',
      }}
    >
      {fn()}
    </div>
  ))
  .add('Transaction page', () => <Transactions />)
  .add('Recurring options', () => {
    const [intervalValue, setIntervalValue] = React.useState(2);
    const [intervalTypeValue, setIntervalType] = React.useState<IntervalType>(
      'MO'
    );
    const [DoMValue, setDoM] = React.useState(7);
    const options = {
      DoMValue,
      intervalTypeValue,
      intervalValue,
      setDoM,
      setInterval: setIntervalValue,
      setTypeInterval: setIntervalType,
    };
    return <RecurringTransactionOptions {...options} />;
  });

storiesOf('Input/Text', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('With placeholder', () => (
    <Input
      ariaLabel="date-input"
      type="text"
      id="lipsum"
      placeholder="Welcome to the jungle"
    >
      Lorem ipsum
    </Input>
  ));

storiesOf('Input/Date', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('With placeholder', () => (
    <Input
      ariaLabel="date-input"
      type="date"
      id="lipsum"
      placeholder="Welcome to the jungle"
    >
      Lorem ipsum
    </Input>
  ));

storiesOf('Input/Checkbox', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('Unticked', () => {
    const [value, setState] = React.useState(false);
    const props = {
      id: '_',
      setState,
      value,
    };
    return (
      <Checkbox name="test" {...props}>
        Lipsum?
      </Checkbox>
    );
  })
  .add('Ticked', () => {
    const [value, setState] = React.useState(true);
    const props = {
      id: '_',
      setState,
      value,
    };
    return (
      <Checkbox name="test" {...props}>
        Lipsum?
      </Checkbox>
    );
  });

storiesOf('Filters', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('With placeholder', () => {
    const filterFn = () => true;
    return <Filters setFilter={filterFn} />;
  });

storiesOf('Add new transaction', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('Default', () => <AddTransaction />);

storiesOf('Input/Textarea', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('With placeholder', () => {
    const [value, setState] = React.useState('');
    return (
      <TextArea
        id="_"
        value={value}
        setState={setState}
        placeholder="Insert a funny otter fact."
      >
        Welcome to the jungle
      </TextArea>
    );
  });

const values = [
  { name: 'Otter', value: 'otter' },
  { name: 'Cat', value: 'cat' },
  { name: 'Beaver', value: 'beaver' },
];

storiesOf('Input/Select', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('Default', () => {
    const [value, setState] = React.useState('otter');
    return (
      <Select value={value} setState={setState} values={values}>
        Select your spirit animal
      </Select>
    );
  });

storiesOf('SnackBarContainer', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('Long', () => (
    <SnackBarContainer
      good={false}
      content="You are currently signed in as [insert user here]. A really long sentence to test max length capacity. It is red. It will only break after hitting 70vw."
      speed="fast"
    />
  ));

storiesOf('SnackBarContainer', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('Fast', () => (
    <SnackBarContainer good={true} content="Short and fast" speed="fast" />
  ));
storiesOf('SnackBarContainer', module)
  .addDecorator(fn => (
    <div style={{ margin: '2em', background: theme.palette.primary.main }}>
      {fn()}
    </div>
  ))
  .add('Medium', () => (
    <SnackBarContainer
      good={true}
      content="Medium speed and medium length."
      speed="medium"
    />
  ));
