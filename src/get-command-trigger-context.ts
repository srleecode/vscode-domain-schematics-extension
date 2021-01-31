import { Uri } from "vscode";
import { isCypressFolder, isLibraryFolder } from "./domain-utils";
import { DomainLibraryName } from "./model/domain-library-name.enum";

export interface CommandTriggerContext {
  application: string;
  topLevelDomain?: string;
  childDomain?: string;
  library?: DomainLibraryName;
  cypressFolder?: CypressFolder;
  path: string;
}

type CypressFolder = "cypress" | "storybook";

export const getCommandTriggerContext = (
  triggeredFromUri: Uri
): CommandTriggerContext => {
  const splitPath = getLibraryPath(triggeredFromUri.path).split("/");
  const libsFolderIndex = splitPath.findIndex((folder) => folder === "libs");
  const application = splitPath[libsFolderIndex + 1];
  let topLevelDomain = splitPath[libsFolderIndex + 2];
  let secondLevelFolder = splitPath[libsFolderIndex + 3];
  let domain = topLevelDomain;
  const context: CommandTriggerContext = {
    application,
    topLevelDomain,
    path: getLibraryPath(triggeredFromUri.fsPath),
  };
  if (isCypressFolder(secondLevelFolder)) {
    context.cypressFolder = secondLevelFolder.replace(".", "") as CypressFolder;
  }
  if (domain && secondLevelFolder && !isCypressFolder(secondLevelFolder)) {
    if (isLibraryFolder(secondLevelFolder)) {
      context.library = secondLevelFolder as DomainLibraryName;
    } else {
      domain += `/${secondLevelFolder}`;
      context.childDomain = secondLevelFolder;
      const library = splitPath[libsFolderIndex + 4];
      if (library) {
        context.library = library as DomainLibraryName;
      }
    }
  }
  return context;
};

const getLibraryPath = (path: string): string => path.replace("/src/lib", "");
