import { CommandTriggerContext } from "./get-command-trigger-context";
import { getDefaultValue } from "./get-default-value";
import { DomainAction } from "./model/domain-action";
import { ExtensionConfiguration } from "./model/extension-configuration";
import * as domainUtils from "./domain-utils";
import { DomainLibraryName } from "./model/domain-library-name.enum";
import { ChangeDetection } from "./model/change-detection.enum";
const fs = require("fs");

jest.mock("fs");
jest.mock("vscode", () => {}, { virtual: true });

describe("getDefaultValue", () => {
  const extensionConfiguration: ExtensionConfiguration = {
    style: "scss",
    prefix: "test-prefix",
    collection: "@srleecode/domain",
    lint: "eslint",
    uiFramework: "@storybook/angular",
    addJestJunitReporter: true,
    displayBlock: true,
    isExported: true,
    buildable: true,
    enableIvy: true,
    strict: true,
    publishable: false,
    ngrxFolder: "state",
  };
  beforeEach(() => {
    jest
      .spyOn(domainUtils, "getLibraries")
      .mockReturnValue([DomainLibraryName.dataAccess, DomainLibraryName.shell]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should set domain to top level domain when it is defined and option key is domain", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "top-level-domain",
      path: "",
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
      path: "",
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
      path: "",
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
      path: "",
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
      path: "",
    };

    expect(
      getDefaultValue(
        "libraries",
        DomainAction.addLibraries,
        commandTriggerContext,
        extensionConfiguration
      )
    ).toEqual(["feature", "ui", "util"]);
  });
  it("should only show remove library options for libraries that exist", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "top-level-domain",
      childDomain: "child-domain",
      path: "",
    };

    expect(
      getDefaultValue(
        "libraries",
        DomainAction.removeLibraries,
        commandTriggerContext,
        extensionConfiguration
      )
    ).toEqual(["data-access", "shell"]);
  });
  it("should set change detection based on library type clicked", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "top-level-domain",
      childDomain: "child-domain",
      library: DomainLibraryName.ui,
      path: "",
    };

    expect(
      getDefaultValue(
        "changeDetection",
        DomainAction.addComponent,
        commandTriggerContext,
        extensionConfiguration
      )
    ).toBe(ChangeDetection.onPush);
  });
  describe("ngrx default values", () => {
    it("should set path for ngrx files", () => {
      const commandTriggerContext: CommandTriggerContext = {
        application: "application",
        topLevelDomain: "top-level-domain",
        childDomain: "child-domain",
        library: DomainLibraryName.dataAccess,
        path: "",
      };

      expect(
        getDefaultValue(
          "path",
          DomainAction.addNgrxFeature,
          commandTriggerContext,
          extensionConfiguration
        )
      ).toBe(
        `libs/${commandTriggerContext.application}/${commandTriggerContext.topLevelDomain}/${commandTriggerContext.childDomain}/${commandTriggerContext.library}/src/lib/${extensionConfiguration.ngrxFolder}`
      );
    });
    it("should set project", () => {
      const commandTriggerContext: CommandTriggerContext = {
        application: "application",
        topLevelDomain: "top-level-domain",
        childDomain: "child-domain",
        library: DomainLibraryName.dataAccess,
        path: "",
      };

      expect(
        getDefaultValue(
          "project",
          DomainAction.addNgrxFeature,
          commandTriggerContext,
          extensionConfiguration
        )
      ).toBe(
        `${commandTriggerContext.application}-${commandTriggerContext.topLevelDomain}-${commandTriggerContext.childDomain}-${commandTriggerContext.library}`
      );
    });
    it("should set name to domain", () => {
      const commandTriggerContext: CommandTriggerContext = {
        application: "application",
        topLevelDomain: "top-level-domain",
        childDomain: "child-domain",
        library: DomainLibraryName.dataAccess,
        path: "",
      };

      expect(
        getDefaultValue(
          "name",
          DomainAction.addNgrxFeature,
          commandTriggerContext,
          extensionConfiguration
        )
      ).toBe(
        `${commandTriggerContext.topLevelDomain}-${commandTriggerContext.childDomain}`
      );
    });
    it("should set module to existing module name", () => {
      const commandTriggerContext: CommandTriggerContext = {
        application: "application",
        topLevelDomain: "top-level-domain",
        childDomain: "child-domain",
        library: DomainLibraryName.dataAccess,
        path: "",
      };
      const moduleFileName = `${commandTriggerContext.application}-${commandTriggerContext.topLevelDomain}-${commandTriggerContext.childDomain}-${commandTriggerContext.library}.module.ts`;
      jest.spyOn(fs, "readdirSync").mockReturnValue(["", moduleFileName]);
      expect(
        getDefaultValue(
          "module",
          DomainAction.addNgrxFeature,
          commandTriggerContext,
          extensionConfiguration
        )
      ).toBe(`../${moduleFileName}`);
    });
  });
  it("should set lintFilePattern to domain library folder", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "top-level-domain",
      childDomain: "child-domain",
      library: DomainLibraryName.dataAccess,
      path: "",
    };

    expect(
      getDefaultValue(
        "lintFilePatterns",
        DomainAction.runLint,
        commandTriggerContext,
        extensionConfiguration
      )
    ).toBe(
      `libs/${commandTriggerContext.application}/${commandTriggerContext.topLevelDomain}/${commandTriggerContext.childDomain}/${commandTriggerContext.library}/src/lib`
    );
  });
});
