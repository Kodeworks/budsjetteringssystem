import React from 'react';

export interface IAuth {
  access?: string;
  refresh?: string;
}

export let AuthCtx: React.Context<IAuth> = React.createContext({});
