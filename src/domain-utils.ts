import { lstatSync, readdirSync } from "fs";
import { basename, join } from "path";
import { Uri, workspace } from "vscode";
import { CommandTriggerContext } from "./get-command-trigger-context";
import { DomainLibraryName } from "./model/domain-library-name.enum";

const isDirectory = (path: string) => lstatSync(path).isDirectory();

export const getDirectories = (path: string) =>
  readdirSync(path)
    .map((name) => join(path, name))
    .filter(isDirectory);

export const getLibraries = (
  commandTriggerContext: CommandTriggerContext
): DomainLibraryName[] => {
  let folder = `libs/${commandTriggerContext.application}/${commandTriggerContext.topLevelDomain}`;
  if (commandTriggerContext.childDomain) {
    folder += `/${commandTriggerContext.childDomain}`;
  }
  const rootPath = getWorkspaceRootPath();
  if (rootPath) {
    const fullPath = join(rootPath, folder);
    const directories = getDirectories(fullPath);
    const folders = directories.map((path) => basename(path));
    return folders.filter(isLibraryFolder) as DomainLibraryName[];
  }
  return [];
};

export const getWorkspaceRootPath = (): string =>
  (workspace.workspaceFolders || [])[0]?.uri?.fsPath;

export const isLibraryFolder = (domainName: string): boolean =>
  Object.values(DomainLibraryName).some(
    (libraryName) => domainName === libraryName
  );

export const isCypressFolder = (domainName: string): boolean =>
  [".cypress", ".storybook"].some(
    (cypressFolder) => domainName === cypressFolder
  );
