/**
 * Originally posted [here](https://gist.github.com/samgiles/762ee337dff48623e729) by @ichpuchtli.
 * I have only edited some syntax for personal preference, but it functions identically.
 *
 * I'm using this as Array.prototype.flatMap is not supported by nodejs < 11.0 IIRC.
 */
export function flatMap<T, U>(
  array: Array<T>,
  mapFunc: (x: T) => Array<U>
): Array<U> {
  return array.reduce(
    (cumulus: Array<U>, next: T) => [...mapFunc(next), ...cumulus],
    [] as Array<U>
  );
}
