import {storiesOf} from '@storybook/react';
import {themes} from '@storybook/theming';
import React from 'react';

import Authentication, { AuthType } from '../components/organism/Authentication/Authentication';

//  const Wrapper = styled.div`
//   min-width: 200px;
//   max-width: 400px;
// `

storiesOf('Authentication', module)
  .addParameters({ options: { theme: themes.dark } })
  .add('Login', () => <Authentication type={AuthType.Login} />)
  .add('Register', () => <Authentication type={AuthType.Register} />);
