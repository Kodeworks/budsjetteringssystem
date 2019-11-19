import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { currencyFormat } from '../../helpers/currency';
import explodeRecurring from '../../helpers/explode_recurring';
import { useAuthState } from '../../store/contexts/auth';
import { useTransactionState } from '../../store/contexts/transactions';
import PageTitle from '../atoms/PageTitle';

const Projections: React.FC<{ className?: string }> = ({ className }) => {
  const store = useTransactionState();
  const auth = useAuthState();

  const recurringTransactions = React.useMemo(() => explodeRecurring(store), [
    store,
  ]);

  const transactions = React.useMemo(
    () =>
      store.transactions
        .concat(recurringTransactions)
        .filter(e => e.company_id === auth!.selectedCompany!),
    [auth, recurringTransactions, store.transactions]
  );

  const pastAccumulatedBalance = React.useMemo(
    () =>
      transactions
        .filter(t => moment(t.date).isBefore(moment(), 'day'))
        .reduce(
          (prev, curr) =>
            prev + (curr.type === 'IN' ? curr.money : -curr.money) / 100,
          0
        ),
    [transactions]
  );

  let accumulatedBalance = pastAccumulatedBalance;

  const renderTransactions = () =>
    transactions
      .filter(t =>
        moment(t.date).isBetween(
          moment(),
          moment().add(5, 'years'),
          'month',
          '[]'
        )
      )
      .sort((t1, t2) => (t2.date > t1.date ? -1 : 1))
      .map((t, i, arr) => {
        accumulatedBalance += (t.type === 'IN' ? t.money : -t.money) / 100;
        const date = moment(t.date, moment.ISO_8601);
        return (
          <React.Fragment key={`${t.id}-${i}`}>
            {i === 0 ||
            (arr[i - 1] &&
              !moment(arr[i - 1].date, moment.ISO_8601).isSame(
                date,
                'month'
              )) ? (
              <h3>{date.format('MMMM YYYY')}</h3>
            ) : null}
            <div className="projection-row">
              <p>{date.format('DD/MM/YYYY')}</p>
              <p>{t.description}</p>
              <p>{currencyFormat(t.type === 'IN' ? t.money / 100 : 0)}</p>
              <p>{currencyFormat(t.type === 'EX' ? t.money / 100 : 0)}</p>
              <p>{currencyFormat(accumulatedBalance)}</p>
            </div>
          </React.Fragment>
        );
      });

  return (
    <div className={className}>
      <PageTitle
        title="Projections"
        description="View the projected liquidity of your company."
      />

      <div className="projection-row projection-header">
        <strong>Date</strong>
        <strong>Description</strong>
        <strong>Income</strong>
        <strong>Expense</strong>
        <strong>Balance</strong>
      </div>
      <div className="projection-table">{renderTransactions()}</div>
    </div>
  );
};

export default styled(Projections)`
  .projection-row {
    font-size: 1.2em;
    font-weight: normal;
    display: grid;
    grid-template-columns: repeat(5, 1fr);

    p {
      align-self: center;
    }

    p:nth-last-child(-n + 3),
    strong:nth-last-child(-n + 3) {
      text-align: right;
    }
  }

  h3 {
    grid-column: 1 / span 5;

    &:not(:first-child) {
      margin-top: 2em;
    }
  }

  .projection-table {
    margin-top: 2em;
  }

  .projection-header {
    strong {
      font-weight: 600;
    }

    position: sticky;
    top: calc(4em - 3px);
    padding: 1.5em 1em 1em;
    margin: -1.5em -1em 0; /* Negate the effect of padding when not stuck */
    background: ${props => props.theme.palette.background.default};
    border-bottom: 2px solid ${props => props.theme.palette.primary.default};
  }
`;
