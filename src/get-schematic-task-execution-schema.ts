import { readFileSync } from "fs";
import { TaskExecutionSchema } from "./nx-console/task-execution-schema";
import { CommandTriggerContext } from "./get-command-trigger-context";
import { getExtensionConfiguration } from "./get-extension-configuration";
import { Command } from "./model/command";
import { DomainAction, getDomainActionName } from "./model/domain-action";
import { getProject } from "./get-project";
import { getDefaultValue } from "./get-default-value";
import { showError } from "./error-utils";
import { getSchemaJson } from "./schema-utils";
import { getEnumTooltips } from "./get-enum-tooltips";
import {
  isLongFormXPrompt,
  isOptionItemLabelValue,
  XPrompt,
} from "./model/x-prompt.model";
import { getCollection } from "./get-collection";

export const getSchematicTaskExecutionSchema = (
  schematicName: DomainAction,
  commandType: Command,
  workspaceJsonPath: string,
  commandTriggerContext: CommandTriggerContext
): TaskExecutionSchema | undefined => {
  const name = getDomainActionName(schematicName);
  const useNxCli = workspaceJsonPath.endsWith("workspace.json");
  const cliName = useNxCli ? "nx" : "ng";
  const project = getProject(commandTriggerContext);
  let builder = "";
  if (commandType === Command.run) {
    builder = getBuilder(workspaceJsonPath, project, name);
  }
  const extensionConfiguration = getExtensionConfiguration();
  const collection = getCollection(
    schematicName,
    extensionConfiguration.collection
  );
  const schematicJson = getSchemaJson(commandType, builder, name, collection);
  const options = Object.keys(schematicJson.properties).map((key) => {
    const option = {
      name: key,
      ...schematicJson.properties[key],
    };
    delete option.items;
    const xPrompt: XPrompt = option["x-prompt"];
    const defaultValue = getDefaultValue(
      key,
      schematicName,
      commandTriggerContext,
      extensionConfiguration
    );
    if (option.enum) {
      option.items = option.enum.map((item: any) => item.toString());
    }
    if (xPrompt) {
      option.tooltip = isLongFormXPrompt(xPrompt) ? xPrompt.message : xPrompt;
      option.itemTooltips = getEnumTooltips(xPrompt);
      if (isLongFormXPrompt(xPrompt) && !option.items) {
        const items = (xPrompt.items || []).map((item) =>
          isOptionItemLabelValue(item) ? item.value : item
        );
        if (items.length > 0) {
          option.items = items;
        }
      }
    }
    if (defaultValue) {
      option.default = defaultValue;
    }

    return option;
  });

  return {
    name,
    collection: commandType === Command.generate ? collection : "",
    options,
    description: schematicJson.description,
    command: getCommand(commandType, name),
    positional: getPositional(commandType, project, collection, name),
    cliName,
    contextValues: undefined,
  };
};

const getCommand = (commandType: Command, name: string): string => {
  if (commandType === Command.generate) {
    return Command.generate.toString();
  }
  if (isNativelySupportedProject(name)) {
    return name;
  }
  return "run";
};

const getPositional = (
  commandType: Command,
  project: string,
  collection: string,
  name: string
): string => {
  if (commandType === Command.generate) {
    return `${collection}:${name}`;
  }
  if (isNativelySupportedProject(name)) {
    return project;
  }
  return `${project}:${name}`;
};

const isNativelySupportedProject = (project: string): boolean =>
  ["e2e", "lint", "test"].includes(project);

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
  if (workspaceJson.projects[project].architect) {
    return workspaceJson.projects[project].architect[name].builder;
  }
  return workspaceJson.projects[project].targets[name].executor;
};
