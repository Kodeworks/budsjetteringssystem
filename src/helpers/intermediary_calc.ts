/**
 * @author "Fredrik August Madsen-Malmo"
 * @summary "Funtion to summarize the elements in the transaction ``shopping cart''"
 */

import { IState as IStore } from '../reducers/transactions';

export const sum = (store: IStore) => (
  store.intermediary.reduce((prev, curr) => (
    // We definitely know that this transaction will exist as we're adding transaction ids to the intermediary array.
    prev + store.transactions.find(e => e.id === curr)!.money
  ), 0)
);
