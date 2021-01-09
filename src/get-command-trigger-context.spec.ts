jest.mock("vscode", () => {}, { virtual: true });
import {
  CommandTriggerContext,
  getCommandTriggerContext,
} from "./get-command-trigger-context";
import * as extensionConfig from "./get-extension-configuration";
import { DomainLibraryName } from "./model/domain-library-name.enum";

describe("getCommandTriggerContext", () => {
  beforeAll(() =>
    jest
      .spyOn(extensionConfig, "getExtensionConfiguration")
      .mockImplementation(() => ({} as any))
  );

  it("should return application and domain as parent domain when given parent domain folder", () => {
    const command = getCommandTriggerContext({
      path: "libs/application/domain",
    } as any);
    const expected: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "domain",
    };
    expect(command).toEqual(expected);
  });
  it("should return application and undefined domain when given application folder", () => {
    const command = getCommandTriggerContext({
      path: "libs/application",
    } as any);
    const expected: CommandTriggerContext = {
      application: "application",
    };
    expect(command).toEqual(expected);
  });
  it("should return application and domain as child domain when given child domain folder", () => {
    const command = getCommandTriggerContext({
      path: "libs/application/domain/child",
    } as any);
    const expected: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "domain",
      childDomain: "child",
    };
    expect(command).toEqual(expected);
  });
  it("should return application, domain and library when given library folder", () => {
    const command = getCommandTriggerContext({
      path: "libs/application/domain/data-access",
    } as any);
    const expected: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "domain",
      library: DomainLibraryName.dataAccess,
    };
    expect(command).toEqual(expected);
  });
  it("should return application, domain, childDomain and library when given library folder in childDomain", () => {
    const command = getCommandTriggerContext({
      path: "libs/application/domain/child-domain/data-access",
    } as any);
    const expected: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "domain",
      childDomain: "child-domain",
      library: DomainLibraryName.dataAccess,
    };
    expect(command).toEqual(expected);
  });
  it("should set application and domain when clicking on storybook folder", () => {
    const command = getCommandTriggerContext({
      path: "libs/application/domain/.storybook",
    } as any);
    const expected: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "domain",
      cypressFolder: "storybook",
    };
    expect(command).toEqual(expected);
  });
});
