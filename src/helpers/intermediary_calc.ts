/**
 * @author "Fredrik August Madsen-Malmo"
 * @summary "Funtion to summarize the elements in the transaction ``shopping cart''"
 */

export const sum = (
  store: import('./../store/reducers/transactions').ITransactionState
) =>
  store.intermediary.reduce((prev, curr) => {
    // We definitely know that this transaction will exist as we're adding transaction ids to the intermediary array.
    const tx = store.transactions.find(e => e.id === curr)!;
    return prev + (tx.type === 'expense' ? -tx.money : tx.money) / 100;
  }, 0);
