export interface IPaginated<T> {
  count: number;
  next: string;
  previous: string;
  results: Array<T>;
}
