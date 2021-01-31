import { Uri, workspace } from "vscode";
import { ExtensionConfiguration } from "./model/extension-configuration";

export const getExtensionConfiguration = (): ExtensionConfiguration => {
  const domainSchematicsConfig = workspace.getConfiguration("domainSchematics");
  const style = domainSchematicsConfig.get("style") as "scss" | "less" | "css";
  const prefix = domainSchematicsConfig.get("prefix") as string;
  const collection = domainSchematicsConfig.get("collection") as string;
  const lint = domainSchematicsConfig.get("lint") as "eslint" | "tslint";
  const addJestJunitReporter = domainSchematicsConfig.get(
    "addJestJunitReporter.enabled"
  ) as boolean;
  const uiFramework = domainSchematicsConfig.get("uiFramework") as
    | "@storybook/angular"
    | "@storybook/react";
  const displayBlock = domainSchematicsConfig.get(
    "displayBlock.enabled"
  ) as boolean;
  const isExported = domainSchematicsConfig.get(
    "isExported.enabled"
  ) as boolean;
  const buildable = domainSchematicsConfig.get("buildable.enabled") as boolean;
  const publishable = domainSchematicsConfig.get(
    "publishable.enabled"
  ) as boolean;
  const strict = domainSchematicsConfig.get("strict.enabled") as boolean;
  const enableIvy = domainSchematicsConfig.get("enableIvy.enabled") as boolean;
  const ngrxFolder = domainSchematicsConfig.get("ngrxFolder") as string;

  return {
    style,
    prefix,
    collection,
    lint,
    addJestJunitReporter,
    uiFramework,
    displayBlock,
    isExported,
    buildable,
    publishable,
    strict,
    enableIvy,
    ngrxFolder,
  };
};
