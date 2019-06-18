import React from 'react';
import {storiesOf} from '@storybook/react'
import {themes} from '@storybook/theming';
import AuthenticationCard from '../components/organism/AuthenticationCard';

storiesOf('LoginPage/Organisms', module)
  .addParameters({ options: { theme: themes.dark } })
  .add(
    'AuthenticationCard',
    () => <AuthenticationCard/>
  )