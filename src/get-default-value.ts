import { getLibraries } from "./domain-utils";
import { showError } from "./error-utils";
import { CommandTriggerContext } from "./get-command-trigger-context";
import { ChangeDetection } from "./model/change-detection.enum";
import { DomainAction } from "./model/domain-action";
import { DomainLibraryName } from "./model/domain-library-name.enum";
import { ExtensionConfiguration } from "./model/extension-configuration";
import { sep } from "path";
const fs = require("fs");

export const getDefaultValue = (
  optionKey: string,
  action: DomainAction,
  commandTriggerContext: CommandTriggerContext,
  extensionConfiguration: ExtensionConfiguration
): string | string[] | boolean | undefined => {
  const commandContextValue = (commandTriggerContext as any)[optionKey];
  const extensionContextValue = (extensionConfiguration as any)[optionKey];
  let contextValue = "";
  if (commandContextValue || commandContextValue === false) {
    contextValue = commandContextValue;
  }
  if (extensionContextValue || extensionContextValue === false) {
    contextValue = extensionContextValue;
  }
  const domain = commandTriggerContext.childDomain
    ? `${commandTriggerContext.topLevelDomain}/${commandTriggerContext.childDomain}`
    : commandTriggerContext.topLevelDomain || "";
  const dashifiedDomain = domain?.replace("/", "-");
  let defaultValue: string | string[] | undefined = contextValue;
  if (optionKey === "domain") {
    defaultValue = getDomainDefaultValue(action, commandTriggerContext);
  } else if (
    optionKey === "libraries" &&
    (action === DomainAction.addLibraries ||
      action === DomainAction.removeLibraries)
  ) {
    defaultValue = getLibrariesDefaultValue(action, commandTriggerContext);
  } else if (
    optionKey === "changeDetection" &&
    action === DomainAction.addComponent
  ) {
    defaultValue = getChangeDetectionDefaultValue(commandTriggerContext);
  } else if (isNgrxAction(action)) {
    defaultValue = getNgrxActionDefaultValue(
      optionKey,
      action,
      commandTriggerContext,
      extensionConfiguration,
      domain
    );
  } else if (optionKey === "path") {
    defaultValue = `libs/${commandTriggerContext.application}/${domain}/${commandTriggerContext.library}/src/lib/${extensionConfiguration.ngrxFolder}`;
  } else if (optionKey === "project") {
    defaultValue = `${commandTriggerContext.application}-${dashifiedDomain}-${commandTriggerContext.library}`;
  } else if (optionKey === "name") {
    defaultValue = dashifiedDomain as string;
  } else if (optionKey === "lintFilePatterns") {
    defaultValue = `libs/${commandTriggerContext.application}/${domain}/${commandTriggerContext.library}/src/lib`;
  }

  return defaultValue;
};

const isNgrxAction = (action: DomainAction): boolean =>
  [
    DomainAction.addNgrxAction,
    DomainAction.addNgrxEffect,
    DomainAction.addNgrxEntity,
    DomainAction.addNgrxFeature,
    DomainAction.addNgrxReducer,
    DomainAction.addNgrxSelector,
    DomainAction.addNgrxStore,
  ].some((ngrxAction) => action === ngrxAction);

const isNgrxActionRequiringModule = (action: DomainAction): boolean =>
  [
    DomainAction.addNgrxEffect,
    DomainAction.addNgrxEntity,
    DomainAction.addNgrxFeature,
    DomainAction.addNgrxReducer,
    DomainAction.addNgrxStore,
  ].some((ngrxAction) => action === ngrxAction);

const getNgrxActionDefaultValue = (
  optionKey: string,
  action: DomainAction,
  commandTriggerContext: CommandTriggerContext,
  extensionConfiguration: ExtensionConfiguration,
  domain: string
) => {
  const dashifiedDomain = domain?.replace("/", "-");
  if (optionKey === "path") {
    return `libs/${commandTriggerContext.application}/${domain}/${commandTriggerContext.library}/src/lib/${extensionConfiguration.ngrxFolder}`;
  } else if (optionKey === "project") {
    return `${commandTriggerContext.application}-${dashifiedDomain}-${commandTriggerContext.library}`;
  } else if (optionKey === "name") {
    return dashifiedDomain as string;
  } else if (optionKey === "module" && isNgrxActionRequiringModule(action)) {
    const path = `${commandTriggerContext.path}${sep}src${sep}lib`;
    const moduleFile = fs
      .readdirSync(path)
      .find((file: string) => file.includes("module.ts"));
    return `../${moduleFile}`;
  } else if (optionKey === "module" && isNgrxActionRequiringModule(action)) {
    const path = `${commandTriggerContext.path}${sep}src${sep}lib`;
    const moduleFile = fs
      .readdirSync(path)
      .find((file: string) => file.includes("module.ts"));
    return `../${moduleFile}`;
  }
};

const getDomainDefaultValue = (
  action: DomainAction,
  commandTriggerContext: CommandTriggerContext
): string => {
  let defaultValue = "";
  if (commandTriggerContext.topLevelDomain) {
    defaultValue = `${commandTriggerContext.topLevelDomain}`;
    if (action === DomainAction.createDomain) {
      defaultValue += "/";
    }
  }
  if (commandTriggerContext.childDomain) {
    defaultValue += `/${commandTriggerContext.childDomain}`;
  }
  return defaultValue;
};

const getChangeDetectionDefaultValue = (
  commandTriggerContext: CommandTriggerContext
): string => {
  if (commandTriggerContext.library === DomainLibraryName.feature) {
    return ChangeDetection.default;
  } else if (commandTriggerContext.library === DomainLibraryName.ui) {
    return ChangeDetection.onPush;
  }
  return ChangeDetection.default;
};

const getLibrariesDefaultValue = (
  action: DomainAction,
  commandTriggerContext: CommandTriggerContext
): string[] => {
  const existingLibraries = getLibraries(commandTriggerContext);
  if (action === DomainAction.addLibraries) {
    let defaultValue = Object.values(DomainLibraryName).filter(
      (libraryName) => !existingLibraries.includes(libraryName)
    );
    if (defaultValue === []) {
      showError(
        "Unable to add a new library as all the library types are already in this domain"
      );
    }
    return defaultValue;
  } else if (action === DomainAction.removeLibraries) {
    return Object.values(DomainLibraryName).filter((libraryName) =>
      existingLibraries.includes(libraryName)
    );
  }
  return [];
};
