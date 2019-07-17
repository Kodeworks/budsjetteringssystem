import * as React from 'react';

import {
  authReducer,
  IAuthState,
  ICreatedAction,
  initialState,
} from '../reducers/auth';

export type AuthDispatch = React.Dispatch<ICreatedAction>;

const AuthStateContext = React.createContext<IAuthState | undefined>(undefined);
const AuthDispatchContext = React.createContext<AuthDispatch | undefined>(
  undefined
);

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

/**
 * Returns the current state of the Auth context
 * @throws {Error} Must be called within a AuthProvider
 */
const useAuthState = () => {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
};

/**
 * Returns only the dispatch function of the Auth context.
 * This is useful if a component shouldn't re-render if the state updates,
 * see https://kentcdodds.com/blog/how-to-optimize-your-context-value for more information.
 *
 * The dispatch function is used to dispatch an action of @type {ActionType}
 * @returns {AuthDispatch} The dispatch function of the Auth context.
 * @throws {Error} Must be called within a AuthProvider
 */
const useAuthDispatch = (): AuthDispatch => {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be called within a AuthProvider');
  }
  return context;
};

export type AuthContextType = [IAuthState, AuthDispatch];
/**
 * Returns the current state AND the dispatch of the Auth context.
 */
// NOTE: The return type must be set to tell TypeScript the correct order of the return Array.
const useAuth = (): AuthContextType => {
  return [useAuthState(), useAuthDispatch()];
};

// Exports
export { initialState, AuthProvider, useAuth, useAuthState, useAuthDispatch };
