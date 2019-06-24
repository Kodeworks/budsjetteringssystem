import React from 'react';
import {storiesOf} from '@storybook/react'
import {themes} from '@storybook/theming';

import AuthenticationCard from '../components/molecules/AuthenticationCard';

//  const Wrapper = styled.div`
//   min-width: 200px;
//   max-width: 400px;
// `

storiesOf('AuthenticationCard', module)
  .addParameters({ options: { theme: themes.dark } })
  .add('AuthenticationCard', () => <AuthenticationCard/>);
