import { readFileSync } from "fs";
import { window } from "vscode";
import { TaskExecutionSchema } from "./nx-console/task-execution-schema";
import { CommandTriggerContext } from "./get-command-trigger-context";
import { getExtensionConfiguration } from "./get-extension-configuration";
import { Command } from "./model/command";
import { DomainAction, getDomainActionName } from "./model/domain-action";
import { getProject } from "./get-project";
import { getSchemaPath } from "./get-schema-path";
import { getDefaultValue } from "./get-default-value";
import { showError } from "./error-utils";
import { getSchemaJson } from "./schema-utils";

export const getSchematicTaskExecutionSchema = (
  schematicName: DomainAction,
  command: Command,
  workspaceJsonPath: string,
  commandTriggerContext: CommandTriggerContext
): TaskExecutionSchema | undefined => {
  const name = getDomainActionName(schematicName);

  const useNxCli = workspaceJsonPath.endsWith("workspace.json");
  const cliName = useNxCli ? "nx" : "ng";
  const project = getProject(commandTriggerContext);
  let builder = "";
  if (command === Command.run) {
    builder = getBuilder(workspaceJsonPath, project, name);
  }
  const schematicJson = getSchemaJson(command, builder, name);
  const extensionConfiguration = getExtensionConfiguration();
  const collection = extensionConfiguration.collection;
  const options = Object.keys(schematicJson.properties).map((key) => {
    const option = {
      name: key,
      ...schematicJson.properties[key],
    };
    const defaultValue = getDefaultValue(
      key,
      schematicName,
      commandTriggerContext,
      extensionConfiguration
    );
    if (!!defaultValue) {
      option.default = defaultValue;
    }

    return option;
  });

  return {
    name,
    collection: command === Command.generate ? collection : "",
    options,
    description: schematicJson.description,
    command: command === Command.generate ? command : name,
    positional:
      command === Command.generate ? `${collection}:${name}` : project,
    cliName,
    contextValues: undefined,
  };
};

const getBuilder = (
  workspaceJsonPath: string,
  project: string,
  name: string
): string => {
  const workspaceJsonFile = readFileSync(workspaceJsonPath);
  const workspaceJson = JSON.parse(workspaceJsonFile.toString());
  if (!workspaceJson.projects[project]) {
    showError(`unable to find builder for ${project}`);
  }
  return workspaceJson.projects[project].architect[name].builder;
};
