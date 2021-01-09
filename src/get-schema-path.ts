import { join } from "path";
import { getWorkspaceRootPath } from "./domain-utils";
import { getFullPath, isFile } from "./file-utils";
import { Command } from "./model/command";

export const getSchemaPath = (
  command: Command,
  builder: string,
  action: string,
  isNrwlPlugin: boolean
): string => {
  let schemaPath = "";
  const rootPath = getWorkspaceRootPath();
  if (command === Command.generate) {
    schemaPath = `node_modules/@srleecode/domain/src/schematics/${dashify(
      action
    )}/schema.json`;
  } else if (command === Command.run) {
    const splitBuilder = builder.split(":");
    if (isNrwlPlugin) {
      schemaPath = `node_modules/${splitBuilder[0]}/src/${splitBuilder[1]}/schema.json`;
    } else {
      schemaPath = `node_modules/${splitBuilder[0]}/src/builders/${splitBuilder[1]}/schema.json`;
    }
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
