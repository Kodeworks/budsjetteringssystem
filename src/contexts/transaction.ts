import React from 'react';

import { IAction, ITransactionState } from '../reducers/transactions';

interface IContext {
  store: ITransactionState;
  dispatch: React.Dispatch<IAction>;
}

export let TransactionCtx: React.Context<IContext>;

export const createTransactionCtx = (store: ITransactionState, dispatch: React.Dispatch<IAction>) => {
  TransactionCtx = React.createContext<IContext>({ store, dispatch });
};
