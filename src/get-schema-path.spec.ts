import * as fileUtils from "./file-utils";
import * as domainUtils from "./domain-utils";
import { getSchemaPath } from "./get-schema-path";
import { Command } from "./model/command";
import { DomainAction } from "./model/domain-action";
import { sep } from "path";
jest.mock("vscode", () => {}, { virtual: true });

describe("getSchemaPath", () => {
  beforeEach(() => {
    jest.spyOn(domainUtils, "getWorkspaceRootPath").mockReturnValue("");
    jest.spyOn(fileUtils, "getFullPath");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("generate", () => {
    beforeEach(() => {
      jest.spyOn(fileUtils, "isFile").mockReturnValue(true);
    });
    it("should read srleecode domain schematic schema when command is generate", () => {
      const schemaPath = getSchemaPath(
        Command.generate,
        DomainAction.createDomain,
        "@srleecode/domain"
      );
      expect(schemaPath).toBe(
        `node_modules${sep}@srleecode${sep}domain${sep}src${sep}schematics${sep}create-domain${sep}schema.json`
      );
    });
    it("should get path for ngrx schematic", () => {
      const schemaPath = getSchemaPath(
        Command.generate,
        DomainAction.addNgrxReducer,
        "@ngrx/schematics"
      );
      expect(schemaPath).toBe(
        `node_modules${sep}@ngrx${sep}schematics${sep}src${sep}addNgrxReducer${sep}schema.json`
      );
    });
  });
  describe("run", () => {
    it("should read standard builder format schema when command is run and it is not a nrwl plugin", () => {
      jest
        .spyOn(fileUtils, "isFile")
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
      const schemaPath = getSchemaPath(
        Command.run,
        DomainAction.runLint,
        "@srleecode/domain",
        "@angular-devkit/build-angular:tslint"
      );
      expect(schemaPath).toBe(
        `node_modules${sep}@angular-devkit${sep}build-angular${sep}src${sep}tslint${sep}schema.json`
      );
    });
    it("should return nrwl plugin builder format schema when command is run and it is a nrwl plugin", () => {
      jest
        .spyOn(fileUtils, "isFile")
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
      const schemaPath = getSchemaPath(
        Command.run,
        DomainAction.runLint,
        "@srleecode/domain",
        "@nrwl/linter:lint"
      );
      expect(schemaPath).toBe(
        `node_modules${sep}@nrwl${sep}linter${sep}src${sep}builders${sep}lint${sep}schema.json`
      );
    });
    it("should return nrwl plugin executor format schema when command is run and it is a nrwl plugin", () => {
      jest
        .spyOn(fileUtils, "isFile")
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);
      const schemaPath = getSchemaPath(
        Command.run,
        DomainAction.runLint,
        "@srleecode/domain",
        "@nrwl/linter:lint"
      );
      expect(schemaPath).toBe(
        `node_modules${sep}@nrwl${sep}linter${sep}src${sep}executors${sep}lint${sep}schema.json`
      );
    });
  });
});
