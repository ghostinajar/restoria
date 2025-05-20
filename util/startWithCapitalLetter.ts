// startWithCapitalLetter
// takes a string and returns it with the first letter capitalized

import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function startWithCapitalLetter(string: string): string {
  try {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`startWithCapitalLetter`, error);
    return string; // Return original string in case of error
  }
}

export default startWithCapitalLetter;