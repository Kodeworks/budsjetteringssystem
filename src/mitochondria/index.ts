export interface IError {
  detail: string;
}

// Add endpoints here as needed
const endpoints = [
  '/transaction/',
  '/transaction/all/',
  '/transaction/income/all/',
  '/balance/',
  '/recurring/',
  '/month/',
  '/company/',
  '/user/',
  '/user/login/',
  '/user/register/',
] as const;

// Union of endpoints: '/transaction' | '/transaction/all' | ...
export type ApiEndpoint = typeof endpoints[number];

const BASE_URL = 'http://localhost:8000';

export interface ITokenResponse {
  access: string;
}

/**
 * @summary "Fetches a new access token by using the refresh token."
 * @returns "Whether we successfully managed to fetch a new access token."
 */
export const fetchNewToken = async (): Promise<string> => {
  const refresh = localStorage.getItem('refresh');

  const res = await fetch(`${BASE_URL}/user/refresh/`, {
    body: JSON.stringify({ refresh }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  switch (res.status) {
    case 200:
      return ((await res.json()) as ITokenResponse).access;
    case 401:
      // The refresh token has expired
      throw new Error('Refresh token has expired.');
    default:
      throw new Error(
        'Unexpected response from server when fetching new access token.'
      );
  }
};

interface ICallbacks {
  [statusCode: number]: (resp: Response) => Promise<any>;
}

/**
 * @summary """
 * Perform a fetch call with the access token. Will handle refetching of token
 * if it has expired.
 * """
 *
 * @param url "URL to fetch. Can pass in query parameters if GET request."
 * @param options "Options to pass into the fetch. Body, headers, method etc."
 * @param callbacks "Object with key being HTTP status code, and value is callback."
 */
export const fetchWithCallback = async <T>(
  path: ApiEndpoint,
  queryParams: string,
  options: RequestInit,
  callbacks: ICallbacks
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}${queryParams}`, {
    headers: {
      Authorization: localStorage.getItem('access')
        ? `Bearer ${localStorage.getItem('access')}`
        : '',
      // Default to application/json. This can be overridden by passing headers in options.
      'Content-Type': 'application/json',
    },
    ...options,
  });

  // Call the callback with a status corresponding to the response.
  return await ({
    400: async resp => {
      throw new Error(((await resp.json()) as IError).detail);
    },
    401: async resp => {
      const newToken = await fetchNewToken();
      localStorage.setItem('access', newToken);
      return await fetchWithCallback(path, queryParams, options, callbacks);
    },
    403: async resp => {
      throw new Error(((await resp.json()) as IError).detail);
    },
    404: async resp => {
      throw new Error(((await resp.json()) as IError).detail);
    },
    ...callbacks,
  } as ICallbacks)[res.status](res);
};

// Re-export everything from mitochondria for easier imports
export * from './balances';
export * from './transactions';
export * from './auth';
