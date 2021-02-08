import { join } from "path";
import { getWorkspaceRootPath } from "./domain-utils";
import { getFullPath, isFile } from "./file-utils";
import { Command } from "./model/command";

export const getSchemaPath = (
  command: Command,
  action: string,
  collection: string,
  builder = ""
): string => {
  let schemaPath = "";
  const rootPath = getWorkspaceRootPath();
  if (command === Command.generate) {
    if (collection === "@srleecode/domain") {
      schemaPath = `node_modules/${collection}/src/schematics/${dashify(
        action
      )}/schema.json`;
    } else if (collection === "@ngrx/schematics") {
      schemaPath = `node_modules/@ngrx/schematics/src/${action}/schema.json`;
    }
    if (!isFile(schemaPath)) {
      schemaPath = schemaPath.replace("schematics", "generators");
    }
  } else if (command === Command.run) {
    const splitBuilder = builder.split(":");
    const potentialPaths = [
      `node_modules/${splitBuilder[0]}/src/${splitBuilder[1]}/schema.json`, // non nrwl, e.g. angular tslint
      `node_modules/${splitBuilder[0]}/src/builders/${splitBuilder[1]}/schema.json`, // older nrwl, e.g. eslint
      `node_modules/${splitBuilder[0]}/src/executors/${splitBuilder[1]}/schema.json`, // newer nrwl, e.g. eslint
    ];
    const validFilePaths = potentialPaths.filter((path) => {
      const fullPath = getFullPath(rootPath, path);
      return isFile(fullPath);
    });

    schemaPath = validFilePaths[0];
  }

  const schematicJsonFilePath = getFullPath(rootPath, schemaPath);
  if (!isFile(schematicJsonFilePath)) {
    return "";
  }
  return schematicJsonFilePath;
};

const dashify = (input: string): string => {
  return input
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\W/g, (m) => (/[À-ž]/.test(m) ? m : "-"))
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
};
