import React from 'react';

import { cleanup, render } from '../../../helpers/test-utils';
import { AuthCtx, createAuthCtx } from '../../../store/contexts/auth';
import { initialState, reducer } from '../../../store/reducers/auth';
import AddTransaction from '../AddTransaction';

const Wrapper: React.FC = props => {
  const [auth, dispatch] = React.useReducer(reducer, initialState);
  createAuthCtx(auth, dispatch);

  return (
    <AuthCtx.Provider value={{ store: auth, dispatch }}>
      {props.children}
    </AuthCtx.Provider>
  );
};

afterEach(cleanup);

describe('AddTransaction form', () => {
  test('should render without crashing', () => {
    render(
      <Wrapper>
        <AddTransaction />
      </Wrapper>
    );
  });
});
