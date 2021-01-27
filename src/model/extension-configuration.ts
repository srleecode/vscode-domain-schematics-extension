export interface ExtensionConfiguration {
  style: "scss" | "less" | "css";
  prefix: string;
  collection: string;
  lint: "eslint" | "tslint";
  addJestJunitReporter: boolean;
  uiFramework: "@storybook/angular" | "@storybook/react";
  displayBlock: boolean;
  isExported: boolean;
  buildable: boolean;
  publishable: boolean;
  strict: boolean;
  enableIvy: boolean;
}
