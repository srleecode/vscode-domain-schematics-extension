import * as fileUtils from "./file-utils";
import * as domainUtils from "./domain-utils";
import { getSchemaPath } from "./get-schema-path";
import { Command } from "./model/command";
import { DomainAction } from "./model/domain-action";
jest.mock("vscode", () => {}, { virtual: true });

describe("getSchemaPath", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(fileUtils, "isFile").mockReturnValue(true);
    jest.spyOn(domainUtils, "getWorkspaceRootPath").mockReturnValue("");
    jest.spyOn(fileUtils, "getFullPath");
  });
  it("should read srleecode domain schematic schema when command is generate", () => {
    getSchemaPath(Command.generate, "", DomainAction.createDomain, false);
    expect(fileUtils.getFullPath).toHaveBeenCalledWith(
      "",
      "node_modules/@srleecode/domain/src/schematics/create-domain/schema.json"
    );
  });
  it("should read standard builder format schema when command is run and it is not a nrwl plugin", () => {
    getSchemaPath(
      Command.run,
      "@angular-devkit/build-angular:tslint",
      DomainAction.runLint,
      false
    );
    expect(fileUtils.getFullPath).toHaveBeenCalledWith(
      "",
      "node_modules/@angular-devkit/build-angular/src/builders/tslint/schema.json"
    );
  });
  it("should nrwl plugin builder format schema when command is run and it is a nrwl plugin", () => {
    getSchemaPath(Command.run, "@nrwl/linter:lint", DomainAction.runLint, true);
    expect(fileUtils.getFullPath).toHaveBeenCalledWith(
      "",
      "node_modules/@nrwl/linter/src/lint/schema.json"
    );
  });
});
