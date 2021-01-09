export interface ExtensionConfiguration {
  style: "scss" | "less" | "css";
  prefix: string;
  lint: "eslint" | "tslint";
  addJestJunitReporter: boolean;
  uiFramework: "@storybook/angular" | "@storybook/react";
}
