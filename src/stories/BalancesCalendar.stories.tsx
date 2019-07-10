import {storiesOf} from '@storybook/react';
import React from 'react';
import GlobalWrapper from '../helpers/GlobalWrapper';

import CalendarEntry from '../components/atoms/CalendarEntry';
import { IBalanceEntry } from '../declarations/balanceEntries';

const entry: IBalanceEntry = {
  date: '2019-06-05',
  expense: 200000,
  income: 200000,
  liquidity: 18000000,
};

const divStyle = {
  width: '150px',
};

storiesOf('CalendarEntry', module)
  .add('CalendarEntry', () => (
    <GlobalWrapper>
      <div style={divStyle}>
        <CalendarEntry className={'test'} entry={entry} date={'2019-06-05'} />
      </div>
    </GlobalWrapper>
  ));
