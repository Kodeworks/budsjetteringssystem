/**
 * @author "Ørjan Bostad Vesterlid"
 * @summary "Formats a number as currency with spacing, for example: 1 000 000"
 * @param num "Number that should be formatted"
 * @returns string
 */
export const currencyFormat = (num: number) => {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
};
