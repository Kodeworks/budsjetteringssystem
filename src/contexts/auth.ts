import React from 'react';

import { ILoginResponse } from '../mitochondria/auth';

export let AuthCtx = React.createContext<ILoginResponse>({ access: '', refresh: '' });
