export interface TaskExecutionSchema {
  name: string;
  command: string;
  positional: string;
  cliName: "nx" | "ng";
  collection: string;
  builder?: string;
  description: string;
  configurations?: ArchitectConfiguration[];
  options: any[];
  contextValues?: Record<string, string | number | boolean | undefined>;
}

interface DefaultValue {
  name: string;
  defaultValue: string | undefined;
}

interface ArchitectConfiguration {
  name: string;
  defaultValues: DefaultValue[];
}
