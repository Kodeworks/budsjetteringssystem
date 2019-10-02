import moment from 'moment';
import { flatMap } from './flatMap';

type ITransaction = import('../declarations/transaction').ITransaction;
type IRecurringTransaction = import('../declarations/transaction').IRecurringTransaction;

const intervalTypeConverter = (t: IRecurringTransaction['interval_type']) =>
  ({ DA: 'd' as const, MO: 'M' as const }[t]);

const explodeRecurring = (
  store: import('../store/reducers/transactions').ITransactionState
) =>
  flatMap(store.recurring, e => {
    const dates: Array<string> = [];

    for (
      const d = moment(e.start_date);
      d.isSameOrBefore(moment(e.end_date));
      d.add(e.interval, intervalTypeConverter(e.interval_type))
    ) {
      if (
        // Check if this date has been overwritten
        store.transactions.find(
          t =>
            moment(t.date).isSame(d) &&
            t.recurring_transaction_id === e.id &&
            t.company_id === e.company_id
        )
      ) {
        continue;
      }
      dates.push(d.format('YYYY-MM-DD'));
    }

    return dates.map(
      (date, index) =>
        ({
          company_id: e.company_id,
          date,
          description: e.template.description,
          id: `${date}-${index}`,
          money: e.template.money,
          notes: e.template.notes,
          recurring_transaction_id: e.id,
          type: e.template.type,
        } as ITransaction & { id: string })
    );
  });

export default explodeRecurring;
