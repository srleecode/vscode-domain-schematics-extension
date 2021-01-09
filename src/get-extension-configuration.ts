import { Uri, workspace } from "vscode";
import { ExtensionConfiguration } from "./model/extension-configuration";

export const getExtensionConfiguration = (): ExtensionConfiguration => {
  const domainSchematicsConfig = workspace.getConfiguration("domainSchematics");
  const style = domainSchematicsConfig.get("style") as "scss" | "less" | "css";
  const prefix = domainSchematicsConfig.get("prefix") as string;
  const lint = domainSchematicsConfig.get("lint") as "eslint" | "tslint";
  const addJestJunitReporter = domainSchematicsConfig.get(
    "addJestJunitReporter.enabled"
  ) as boolean;
  const uiFramework = domainSchematicsConfig.get("uiFramework") as
    | "@storybook/angular"
    | "@storybook/react";

  return {
    style,
    prefix,
    lint,
    addJestJunitReporter,
    uiFramework,
  };
};
