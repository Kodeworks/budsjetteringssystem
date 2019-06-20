import React from 'react';
import {storiesOf} from '@storybook/react'
import {themes} from '@storybook/theming';

import AuthenticationCard from '../components/organism/AuthenticationCard';

//  const Wrapper = styled.div`
//   min-width: 200px;
//   max-width: 400px;
// `

storiesOf('LoginPage/Organisms', module)
  .addParameters({ options: { theme: themes.dark } })
  .add(
    'AuthenticationCard',
    () => (
      <AuthenticationCard/>
)
  )