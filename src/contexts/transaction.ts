import React from 'react';

import { IAction, IState } from '../reducers/transactions';

interface IContext {
  store: IState;
  dispatch: React.Dispatch<IAction>;
}

export let TransactionCtx: React.Context<IContext>;

export const createTransactionCtx = (store: IState, dispatch: React.Dispatch<IAction>) => {
  TransactionCtx = React.createContext<IContext>({ store, dispatch });
};
