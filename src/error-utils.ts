import { window } from "vscode";

export const showError = (errorMessage: string): void => {
  window.showErrorMessage(errorMessage);
  throw new Error(errorMessage);
};
