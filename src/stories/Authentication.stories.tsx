import {storiesOf} from '@storybook/react';
import {themes} from '@storybook/theming';
import React from 'react';

import AuthenticationCard, { AuthType } from '../components/molecules/AuthenticationCard';

//  const Wrapper = styled.div`
//   min-width: 200px;
//   max-width: 400px;
// `

storiesOf('AuthenticationCard', module)
  .addParameters({ options: { theme: themes.dark } })
  .add('Login', () => <AuthenticationCard type={AuthType.Login} />)
  .add('Register', () => <AuthenticationCard type={AuthType.Register} />);
