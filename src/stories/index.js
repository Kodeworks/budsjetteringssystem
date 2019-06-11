import React from 'react';

import { storiesOf } from '@storybook/react';

import Heading from '../components/molecules/atoms/Heading';

storiesOf('Heading', module)
  .add('Normal', () => <Heading>Testing abcd</Heading>);
