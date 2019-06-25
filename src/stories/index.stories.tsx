import { addDecorator, storiesOf } from '@storybook/react';
import React from 'react';
import App from '../App';
import CardContainer from '../components/atoms/CardContainer';
import Checkbox from '../components/atoms/Checkbox';
import Input from '../components/atoms/Input';
import NavigationBrand from '../components/atoms/NavigationBrand';
import NavigationPill from '../components/atoms/NavigationPill';
import OutlinedButton from '../components/atoms/OutlinedButton';
import RecurringTransactionOptions from '../components/atoms/RecurringTransactionOptions';
import Select from '../components/atoms/Select';
import TextArea from '../components/atoms/TextArea';
import TransactionEntry from '../components/atoms/TransactionEntry';
import AddTransaction from '../components/molecules/AddTransaction';
import Filters from '../components/molecules/Filters';
import TabMenu from '../components/molecules/TabMenu';
import Navigation from '../components/organism/Navigation';
import Toolbar from '../components/organism/Toolbar';
import Transactions from '../components/organism/Transactions';
import LandingPage from '../components/pages/LandingPage';
import GlobalWrapper from '../helpers/GlobalWrapper';
import { createDummyTransaction } from '../helpers/transaction_creator';
import { navbarWidth } from '../styling/sizes';
import { theme } from '../styling/theme';

addDecorator(storyFn => (
  <GlobalWrapper>
    {storyFn()}
  </GlobalWrapper>
));

const navStyle = {
  background: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '1em',
  width: navbarWidth,
} as React.CSSProperties;

storiesOf('Navigation', module)
  .add('Full', () => (
    <Navigation />
  ))
  .add('Brand', () => (
    <div
      style={navStyle}
    >
      <NavigationBrand />
    </div>
  ));

storiesOf('Navigation/Pill', module)
  .addDecorator(fn => (
  <div
    style={{ width: navbarWidth, padding: '1em', background: theme.palette.primary.main }}
  >
  {fn()}
  </div>
  ),
  )
  .add('Inactive', () => <NavigationPill to="/" active={false}>Inactive</NavigationPill>)
  .add('Active', () => <NavigationPill to="/" active={true}>Active</NavigationPill>);

storiesOf('App', module)
  .add('Full', () => <App />);

storiesOf('Toolbar', module)
  .add('Default', () => <Toolbar />);

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
  .add('Tabs', () => <TabMenu tabLabels={tabs} />);

storiesOf('Dashboard', module)
  .addDecorator(fn => <div style={{ margin: '2em', background: theme.palette.primary.main }}>{fn()}</div>)
  .add('Transactions', () => <Transactions />)
  .add('CardContainer', () => (
  <CardContainer>
    <header>Card</header>
    <p>
      Lorem ipsum dolor amet waistcoat VHS migas,
      you probably haven't heard of them gastropub hammock poke.
      Disrupt you probably haven't heard of them prism, truffaut brunch blue bottle heirloom.
      Pork belly bicycle rights viral cliche direct trade everyday carry.
      Try-hard thundercats affogato brunch hella messenger bag 3 wolf moon celiac ramps heirloom DIY palo santo.
      Church-key salvia pug 8-bit sustainable activated charcoal tattooed direct trade aesthetic narwhal asymmetrical
      retro food truck paleo keytar.
    </p>
    </CardContainer>
    ),
    );

// storiesOf('Dashboard/Transactions', module)
//   .add('Entry (expense)', () => (
//   <GlobalWrapper>
//     <TransactionEntry />
//   </GlobalWrapper>
//   ))
//   .add('Entry (income)', () => <TransactionEntry />);

// storiesOf('Transactions', module)
//   .addDecorator(fn => (
//   <div style={{ width: '80vw', margin: '2em', background: theme.palette.primary.main }}>
//   {fn()}
//   </div>
//   ))
//   .add('Transaction page', () => <Transactions />)
//   .add('Recurring options', () => <RecurringTransactionOptions/>);

// storiesOf('Input/Text', module)
//   .addDecorator(fn => <div style={{ margin: '2em', background: theme.palette.primary.main }}>{fn()}</div>)
//   .add('With placeholder', () => (
//   <Input type="text" id="lipsum" placeholder="Welcome to the jungle">
//     Lorem ipsum
//   </Input>
//     ));

// storiesOf('Input/Date', module)
//   .addDecorator(fn => <div style={{ margin: '2em', background: theme.palette.primary.main }}>{fn()}</div>)
//   .add('With placeholder', () => (
//   <Input type="date" id="lipsum" placeholder="Welcome to the jungle">
//     Lorem ipsum
//   </Input>
//   ));

// storiesOf('Input/Checkbox', module)
//   .addDecorator(fn => <div style={{ margin: '2em', background: theme.palette.primary.main }}>{fn()}</div>)
//   .add('Unticked', () => <Checkbox>Lipsum?</Checkbox>)
//   .add('Ticked', () => <Checkbox value={true}>Lipsum?</Checkbox>);

// storiesOf('Filters', module)
//   .addDecorator(fn => <div style={{ margin: '2em', background: theme.palette.primary.main }}>{fn()}</div>)
//   .add('With placeholder', () => <Filters setFilter={() => {}} />)

// storiesOf('Add new transaction', module)
//   .addDecorator(fn => <div style={{ margin: '2em', background: theme.palette.primary.main }}>{fn()}</div>)
//   .add('Default', () => <AddTransaction />);

// storiesOf('Input/Textarea', module)
//   .addDecorator(fn => <div style={{ margin: '2em', background: theme.palette.primary.main }}>{fn()}</div>)
//   .add(
//     'With placeholder',
//      () => (
//      <TextArea placeholder="Insert a funny otter fact.">
//         Welcome to the jungle
//     </TextArea>
//     ),
//   );

const values = [
  {name: 'Otter', value: 'otter'},
  {name: 'Cat', value: 'cat'},
  {name: 'Beaver', value: 'beaver'},
];

// storiesOf('Input/Select', module)
//   .addDecorator(fn => <div style={{ margin: '2em', background: theme.palette.primary.main }}>{fn()}</div>)
//   .add('Default', () => (
//     <Select values={values}>
//       Select your spirit animal
//     </Select>
//     ),
//   );
