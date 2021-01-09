import { CliTaskDefinition } from "./nx-console/cli-task-definition";
import { TaskExecutionSchema } from "./nx-console/task-execution-schema";

export const getCliTaskWithDefaults = (
  message: CliTaskDefinition,
  schema: TaskExecutionSchema
): CliTaskDefinition => {
  const existingFlagNames = getExistingFlags(message);
  const newFlags = schema.options
    .filter((option) => {
      if (existingFlagNames.has(option.name)) {
        return false;
      }
      if (Array.isArray(option.default)) {
        return option.default.length;
      }
      if (typeof option.default === "boolean") {
        return true;
      }
      return option.default;
    })
    .map(
      (option) => `--${option.name}=${getOptionDefaultString(option.default)}`
    );

  return {
    ...message,
    flags: [...newFlags, ...message.flags],
  };
};

const getExistingFlags = (message: CliTaskDefinition): Set<string> => {
  const existingFlags = new Set<string>();
  message.flags.forEach((flag) => {
    const equalsIndex = flag.indexOf("=");
    const flagName =
      equalsIndex === -1 ? flag.slice(2) : flag.slice(2, equalsIndex);
    existingFlags.add(flagName);
  });
  return existingFlags;
};

const getOptionDefaultString = (
  optionDefault: string[] | string | number | boolean
) => {
  if (Array.isArray(optionDefault)) {
    return optionDefault.join(",");
  }
  return optionDefault;
};
