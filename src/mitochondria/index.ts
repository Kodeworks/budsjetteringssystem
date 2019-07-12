import { IAuthState } from '../store/reducers/auth';

export interface IError {
  detail: string;
}

// Add endpoints here as needed:
const endpoints = [
  '/transaction',
  '/transaction/all',
  '/transaction/income/all',
  '/balance',
  '/recurring',
  '/month',
  '/company',
  '/user',
] as const;
export type ApiEndpoint = typeof endpoints[number]; // union of endpoints: '/transaction' | '/transaction/all' | ...

const BASE_URL = 'http://localhost:8000';

/**
 * This function makes a fetch call to a url with the initOptions as set.
 * It also catches HTTP errors and other errors preventing the promise returned by fetch to be resolved.
 * @param url The URL we want to send a HTTP request to
 * @param initOptions The initOptions to be used as second argument to fetch()
 */
const request = async (url: URL, initOptions?: RequestInit) => {
  try {
    const response = await fetch(url.toString(), initOptions);
    if (!response.ok) {
      throw(handleStatusNotOk(response));
    }
    return response;
  } catch (e) {
    throw (handleError(e));
  }
};

/**
 * This function generates the url, request options,
 * and calls the more generic @function request which makes a 'GET' fetch() call.
 * @param endpoint API endpoint
 * @param data The body of the HTTP request
 * @param authState The authentication state of the application.
 */
export const get = async (
  endpoint: ApiEndpoint,
  queryParams: { [key: string]: any },
  authState: IAuthState,
) => {
  const url = new URL(`${BASE_URL}${endpoint}/`);
  url.search = new URLSearchParams(queryParams).toString();
  const initOptions = {
    headers: {
      'Authentication': `Bearer ${authState.access}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  try {
    const response = await request(url, initOptions);
    return response;
  } catch (e) {
    throw e;
  }
};

/**
 * This function generates the url, request options,
 * and calls the more generic @function request which makes a 'POST' fetch() call.
 * @param endpoint API endpoint
 * @param data The body of the HTTP request
 * @param authState The authentication state of the application.
 */
export const post = async (
  endpoint: ApiEndpoint,
  data: { [key: string]: any },
  authState: IAuthState,
) => {
  const url = new URL(`${BASE_URL}${endpoint}/`);
  const initOptions = {
    body: JSON.stringify(data),
    headers: {
      'Authentication': `Bearer ${authState.access}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  try {
    const response = await request(url, initOptions);
    return response;
  } catch (e) {
    throw e;
  }

};

// ERROR HANDLING:

/*
 * From MDN web docs on fetch( https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch ):
 * The Promise returned from fetch() won’t reject on HTTP error status
 * even if the response is an HTTP 404 or 500.
 * Instead, it will resolve normally (with ok status set to false),
 * and it will only reject on network failure or if anything prevented the request from completing.
 */

 /**
  * This function handles HTTP errors (HTTP 404, 500 etc.)
  * @param response A resolved response promise with 'ok' status value set to false.
  */
const handleStatusNotOk = async (response: Response) => {
  const { status } = response;
  const errorResponse = (await response.json()) as IError;
  switch (status) {
    // TODO – Add cases for different response statuses, 404, 400, 500 etc.
    default:
      return new Error(
        `Unhandled response! Status was not OK: ${status}: ${errorResponse}`,
      );
  }
};

/**
 * This function handles errors caused by network failures or
 * anything else that prevented the fetch() request to be completed.
 * TODO – This method should be develped more to handle errors in a more unified way throughout the application.
 */
const handleError = (error: Error) => {
  return new Error(error.message);
};

// Re-export everything from mitochondria for easier imports
export * from './balances';
export * from './transactions';
