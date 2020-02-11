import queryString from 'query-string';
import { fetchWithCallback } from '../mitochondria';

type IPaginated<T> = import('../declarations/pagination').IPaginated<T>;
type ApiEndpoint = import('../mitochondria').ApiEndpoint;

/**
 * Will create an async iterator that allows the user to iterate through the pagination
 * @param res the response from the initial fetchWithCallback call, this way, we can just wrap stuff in the mitochondria
 */
export async function* paginationIterator<T>(res: IPaginated<T>) {
  let resp = res;

  while (resp.next !== null) {
    yield resp.results;

    // Extract the url and queryParams and retrieve the pathname from the url, as we already handle prepending the BASE_URL in the fetchWithCallback function
    const { url, query } = queryString.parseUrl(resp.next);

    // Hack to prevent it from querying .../api/api/...
    const path = new URL(url).pathname.replace('/api', '');

    resp = await fetchWithCallback<IPaginated<T>>(path as ApiEndpoint, query);
  }

  yield resp.results;
}
