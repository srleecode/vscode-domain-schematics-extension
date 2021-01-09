import { statSync } from "fs";
import { join } from "path";

export const getFullPath = (rootPath: string, schemaPath: string): string =>
  join(rootPath, schemaPath);

export const isFile = (path: string): boolean => {
  try {
    if (!statSync(path).isFile()) {
      return false;
    }
  } catch (err) {
    return false;
  }
  return true;
};
