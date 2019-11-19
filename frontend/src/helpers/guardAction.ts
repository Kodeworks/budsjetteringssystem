/**
 * Only evaluate cb if the question is accepted.
 * @param question The prompt to show the user, for which they will determine whether they want to execute the function or not.
 * @param cb The function which will be called if the user confirms the prompt.
 */
export const guardAction = (question: string, cb: () => void) => {
  if (window.confirm(question)) {
    cb();
  }
};
