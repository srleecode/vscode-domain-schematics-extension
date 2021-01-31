import { readFileSync } from "fs";
import { showError } from "./error-utils";
import { getSchemaPath } from "./get-schema-path";
import { Command } from "./model/command";

export const getSchemaJson = (
  command: Command,
  builder: string,
  name: string,
  collection: string
) => {
  let schematicJsonFilePath = getSchemaPath(
    command,
    name,
    collection,
    builder,
    false
  );
  if (!schematicJsonFilePath) {
    schematicJsonFilePath = getSchemaPath(
      command,
      name,
      collection,
      builder,
      true
    );
  }
  if (!schematicJsonFilePath) {
    let error = `Unable to find schema for ${command} ${collection}:${name} ${builder}.`;
    if (collection === "@srleecode/domain") {
      error += ` Please ensure that you have the latest version of @srleecode/domain installed`;
    } else {
      error += ` Please ensure that you have installed ${collection}`;
    }
    showError(error);
  }
  const schematicJsonFile = readFileSync(schematicJsonFilePath);
  return JSON.parse(schematicJsonFile.toString());
};
