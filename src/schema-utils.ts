import { readFileSync } from "fs";
import { showError } from "./error-utils";
import { getSchemaPath } from "./get-schema-path";
import { Command } from "./model/command";

export const getSchemaJson = (
  command: Command,
  builder: string,
  name: string
) => {
  let schematicJsonFilePath = getSchemaPath(command, builder, name, false);
  if (!schematicJsonFilePath) {
    schematicJsonFilePath = getSchemaPath(command, builder, name, true);
  }
  if (!schematicJsonFilePath) {
    showError(
      `Unable to find schema for ${command} ${name} ${builder}. Please ensure that you have the latest version of @srleecode/domain installed`
    );
  }
  const schematicJsonFile = readFileSync(schematicJsonFilePath);
  return JSON.parse(schematicJsonFile.toString());
};
