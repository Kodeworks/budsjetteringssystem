/**
 * @author "Ørjan Bostad Vesterlid"
 * @summary "Formats a number to have to decimalplaces and ',' separator for each third digit."
 * @param num "Number that should be formatted"
 * @returns string
 */
export const currencyFormat = (num: number) => {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
};
