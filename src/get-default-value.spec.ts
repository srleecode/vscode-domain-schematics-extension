import { CommandTriggerContext } from "./get-command-trigger-context";
import { getDefaultValue } from "./get-default-value";
import { DomainAction } from "./model/domain-action";
import { ExtensionConfiguration } from "./model/extension-configuration";
import * as domainUtils from "./domain-utils";
import { DomainLibraryName } from "./model/domain-library-name.enum";
jest.mock("vscode", () => {}, { virtual: true });

describe("getDefaultValue", () => {
  const extensionConfiguration: ExtensionConfiguration = {
    style: "scss",
    prefix: "test-prefix",
    collection: "@srleecode/domain",
    lint: "eslint",
    uiFramework: "@storybook/angular",
    addJestJunitReporter: true,
  };
  beforeAll(() =>
    jest
      .spyOn(domainUtils, "getLibraries")
      .mockReturnValue([DomainLibraryName.dataAccess, DomainLibraryName.shell])
  );
  it("should set domain to top level domain when it is defined and option key is domain", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "top-level-domain",
    };

    expect(
      getDefaultValue(
        "domain",
        DomainAction.removeDomain,
        commandTriggerContext,
        extensionConfiguration
      )
    ).toBe("top-level-domain");
  });
  it("should include / when create domain action and option key is domain", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "top-level-domain",
    };

    expect(
      getDefaultValue(
        "domain",
        DomainAction.createDomain,
        commandTriggerContext,
        extensionConfiguration
      )
    ).toBe("top-level-domain/");
  });
  it("should include child domain when child domain is defined and option key is domain", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "top-level-domain",
      childDomain: "child-domain",
    };

    expect(
      getDefaultValue(
        "domain",
        DomainAction.removeDomain,
        commandTriggerContext,
        extensionConfiguration
      )
    ).toBe("top-level-domain/child-domain");
  });
  it("should include default value for option that is in the extension configuration", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
    };

    expect(
      getDefaultValue(
        "uiFramework",
        DomainAction.createCypressProject,
        commandTriggerContext,
        extensionConfiguration
      )
    ).toBe(extensionConfiguration.uiFramework);
  });
  it("should only show add library options for libraries that dont exist yet", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "top-level-domain",
      childDomain: "child-domain",
    };

    expect(
      getDefaultValue(
        "libraries",
        DomainAction.addLibraries,
        commandTriggerContext,
        extensionConfiguration
      )
    ).toBe("feature,ui,util");
  });
  it("should only show remove library options for libraries that exist", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "top-level-domain",
      childDomain: "child-domain",
    };

    expect(
      getDefaultValue(
        "libraries",
        DomainAction.removeLibraries,
        commandTriggerContext,
        extensionConfiguration
      )
    ).toBe("data-access,shell");
  });
});
