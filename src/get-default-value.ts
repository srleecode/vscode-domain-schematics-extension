import { window } from "vscode";
import { getLibraries } from "./domain-utils";
import { showError } from "./error-utils";
import { CommandTriggerContext } from "./get-command-trigger-context";
import { ChangeDetection } from "./model/change-detection.enum";
import { DomainAction } from "./model/domain-action";
import { DomainLibraryName } from "./model/domain-library-name.enum";
import { ExtensionConfiguration } from "./model/extension-configuration";

export const getDefaultValue = (
  optionKey: string,
  action: DomainAction,
  commandTriggerContext: CommandTriggerContext,
  extensionConfiguration: ExtensionConfiguration
): string | boolean | undefined => {
  const commandContextValue = (commandTriggerContext as any)[optionKey];
  const extensionContextValue = (extensionConfiguration as any)[optionKey];
  let contextValue = "";
  if (commandContextValue || commandContextValue === false) {
    contextValue = commandContextValue;
  }
  if (extensionContextValue || extensionContextValue === false) {
    contextValue = extensionContextValue;
  }
  let defaultValue = contextValue;
  if (optionKey === "domain") {
    if (commandTriggerContext.topLevelDomain) {
      defaultValue = `${commandTriggerContext.topLevelDomain}`;
      if (action === DomainAction.createDomain) {
        defaultValue += "/";
      }
    }
    if (commandTriggerContext.childDomain) {
      defaultValue += `/${commandTriggerContext.childDomain}`;
    }
  }
  if (
    optionKey === "libraries" &&
    (action === DomainAction.addLibraries ||
      action === DomainAction.removeLibraries)
  ) {
    const existingLibraries = getLibraries(commandTriggerContext);
    if (action === DomainAction.addLibraries) {
      defaultValue = Object.values(DomainLibraryName)
        .filter((libraryName) => !existingLibraries.includes(libraryName))
        .join(",");
      if (defaultValue === "") {
        showError(
          "Unable to add a new library as all the library types are already in this domain"
        );
      }
    } else if (action === DomainAction.removeLibraries) {
      defaultValue = Object.values(DomainLibraryName)
        .filter((libraryName) => existingLibraries.includes(libraryName))
        .join(",");
    }
  } else if (
    optionKey === "changeDetection" &&
    action === DomainAction.addComponent
  ) {
    if (commandTriggerContext.library === DomainLibraryName.feature) {
      defaultValue = ChangeDetection.default;
    } else if (commandTriggerContext.library === DomainLibraryName.ui) {
      defaultValue = ChangeDetection.onPush;
    }
  }

  return defaultValue;
};
