import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import {IBalanceEntry} from '../../declarations/balanceEntries';
import { currencyFormat } from '../../helpers/currency';

interface IPropsCalendarEntry {
  className?: string;
  entry?: IBalanceEntry;
  date: string;
}

const calendarEntry: React.FC<IPropsCalendarEntry> = (props) => {

  return (
    <div className={props.className}>
      <h5>{`${moment(props.date).format('D')}.`}</h5>
      <h5>{props.entry && props.entry.income ? currencyFormat((props.entry.income / 100)) : ''}</h5>
      <h5>{props.entry && props.entry.expense ? `(${currencyFormat((props.entry.expense / 100))})` : ''}</h5>
      <span>{props.entry && <hr />}</span>
      <h5>{props.entry && currencyFormat((props.entry.liquidity / 100))}</h5>
    </div>
  );
};

const BalancesCalendarEntry = styled(calendarEntry)`
  display: grid;
  grid-template-rows: 25% 20% 20% 10% 25%;
  grid-template-columns: 100%;
  height: 90%;
  width: 90%;
  border-radius: ${props => props.theme.shape.borderRadius};
  justify-self: center;
  background-color: ${props => props.theme.palette.background.paper};
  box-shadow: ${props => props.theme.shadow};

  h5 {
    justify-self: center;
    align-self: center;
    margin: 0.8em;
    &:first-of-type {
      font-weight: 700;
      font-size: 1em;
      text-decoration: underline;
      margin-bottom: 1em;
    }
    &:last-of-type {
      font-weight: 700;
    }
  }

  span {
    padding: 0.4em;
  }
`;

export default BalancesCalendarEntry;
