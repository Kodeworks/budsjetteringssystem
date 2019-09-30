import { storiesOf } from '@storybook/react';
import { themes } from '@storybook/theming';
import React from 'react';

import Login from '../components/organism/authentication/Login';
import Register from '../components/organism/authentication/Register';
import GlobalWrapper from '../helpers/GlobalWrapper';

storiesOf('Authentication', module)
  .addParameters({ options: { theme: themes.dark } })
  .addDecorator(fn => <GlobalWrapper>{fn()}</GlobalWrapper>)
  .add('Login', () => <Login />)
  .add('Register', () => <Register />);
