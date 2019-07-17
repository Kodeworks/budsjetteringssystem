import React from 'react';

import { IAuthState, ICreatedAction } from '../reducers/auth';

export interface IAuthContext {
  store: IAuthState;
  dispatch: React.Dispatch<ICreatedAction>;
}

export let AuthCtx: React.Context<IAuthContext>;

export const createAuthCtx = (
  store: IAuthState,
  dispatch: React.Dispatch<ICreatedAction>
) => {
  AuthCtx = React.createContext<IAuthContext>({ store, dispatch });
};
