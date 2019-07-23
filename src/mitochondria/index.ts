export interface IError {
  detail?: string;
  error?: string;
}

export interface IExpiredTokenResponse {
  detail: string;
  code: string;
  messages?: Array<{
    token_class: string;
    token_type: string;
    message: string;
  }>;
}

// Add endpoints here as needed
const endpoints = [
  '/balance/',
  '/balance/bank/',
  '/balance/bank/byDate/',
  '/balance/bank/byDateRange/',
  '/balance/byDateRange/',
  '/company/',
  '/company/',
  '/company/addUser/',
  '/company/removeUser/',
  '/company/setRole/',
  '/month/',
  '/month/all/',
  '/month/byDateRange/',
  '/recurring/',
  '/recurring/',
  '/recurring/active/',
  '/recurring/all/',
  '/recurring/byDate/',
  '/recurring/byDateRange/',
  '/transaction/',
  '/transaction/all/',
  '/transaction/byDate/',
  '/transaction/byDateRange/',
  '/transaction/expense/all/',
  '/transaction/income/all/',
  '/user/',
  '/user/byEmail/',
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
    case 400:
      throw new Error(`Invalid request for new token. Refresh: ${refresh}.`);
    case 401:
      const parsed = (await res.json()) as IExpiredTokenResponse;

      if (parsed.code === 'token_not_valid') {
        throw new Error('Refresh token has expired.');
      } else {
        throw new Error(
          `Unexpected response from backend when refreshing token: ${JSON.stringify(
            parsed
          )}.`
        );
      }
    default:
      throw new Error(
        `Unexpected response from server when fetching new access token.`
      );
  }
};

async function errorHandler(e: Response) {
  throw new Error(await e.text());
}

interface ICallbacks {
  [statusCode: number]: (resp: Response) => Promise<any>;
}

/**
 * @summary """
 * Perform a fetch call with the access token. Will handle refetching of token
 * if it has expired. By default, it will return `Promise<resp.json()>` for 200 and
 * 201 responses.
 * """
 *
 * @param url "URL to fetch. Can pass in query parameters if GET request."
 * @param options "Options to pass into the fetch. Body, headers, method etc."
 * @param callbacks "Object with key being HTTP status code, and value is callback."
 */
export const fetchWithCallback = async <T>(
  path: ApiEndpoint,
  queryParams: string,
  options: RequestInit = {},
  callbacks: ICallbacks = {}
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
  try {
    return await ({
      200: async resp => (await resp.json()) as T,
      201: async resp => (await resp.json()) as T,
      204: async () => true,
      400: async resp => errorHandler(resp),
      401: async resp => {
        try {
          const parsed = (await resp.json()) as IExpiredTokenResponse;

          if (
            parsed.code !== 'token_not_valid' ||
            parsed.detail === 'Authentication credentials were not provided.'
          ) {
            throw new Error('You do not have access to this action.');
          }

          const newToken = await fetchNewToken();
          localStorage.setItem('access', newToken);
          return await fetchWithCallback(path, queryParams, options, callbacks);
        } catch (e) {
          throw new Error(
            `Unexpected error response from server: ${e.message}.`
          );
        }
      },
      403: async resp => errorHandler(resp),
      404: async resp => errorHandler(resp),
      500: async resp => errorHandler(resp),
      ...callbacks,
    } as ICallbacks)[res.status](res);
  } catch (e) {
    throw new Error(
      `encountered for status code ${res.status}. Options were ${Object.entries(
        options
      ).toString() || '{}'}. Path was ${
        queryParams ? `${path}${queryParams}` : path
      }: ${e.message}.`
    );
  }
};

// Re-export everything from mitochondria for easier imports
export * from './balances';
export * from './transactions';
export * from './auth';
export * from './company';
export * from './recurring';
