import { CommandTriggerContext } from "./get-command-trigger-context";
import { getProject } from "./get-project";
import { DomainLibraryName } from "./model/domain-library-name.enum";

describe("getProject", () => {
  it("should return project name with cypress folder, application, child domain and top level domain when they are defined", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      childDomain: "child-domain",
      topLevelDomain: "top-level-domain",
      cypressFolder: "cypress",
      path: "",
    };
    expect(getProject(commandTriggerContext)).toBe(
      "e2e-application-top-level-domain-child-domain"
    );
  });
  it("should return project name with cypress folder, application, child domain when they are defined", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      childDomain: "child-domain",
      cypressFolder: "cypress",
      path: "",
    };
    expect(getProject(commandTriggerContext)).toBe(
      "e2e-application-undefined-child-domain"
    );
  });
  it("should return project name with application, child domain, top level domain and library when they are defined", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      childDomain: "child-domain",
      topLevelDomain: "top-level-domain",
      library: DomainLibraryName.dataAccess,
      path: "",
    };
    expect(getProject(commandTriggerContext)).toBe(
      "application-top-level-domain-child-domain-data-access"
    );
  });
  it("should return project name with  application, child domain  and library when they are defined", () => {
    const commandTriggerContext: CommandTriggerContext = {
      application: "application",
      topLevelDomain: "top-level-domain",
      library: DomainLibraryName.dataAccess,
      path: "",
    };
    expect(getProject(commandTriggerContext)).toBe(
      "application-top-level-domain-data-access"
    );
  });
});
