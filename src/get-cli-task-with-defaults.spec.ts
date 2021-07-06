import { getCliTaskWithDefaults } from "./get-cli-task-with-defaults";
import { CliTaskDefinition } from "./nx-console/cli-task-definition";
import { TaskExecutionSchema } from "./nx-console/task-execution-schema";

describe("getCliTaskWithDefaults", () => {
  it("should add flags for fields except booleans that have defaults", () => {
    const taskDefinition: CliTaskDefinition = {
      command: "generate",
      positional: "@srleecode/domain:create",
      flags: [
        "--libraries=data-access,feature,shell,ui",
        "--no-interactive",
        "--dry-run",
      ],
    };
    const schema: TaskExecutionSchema = {
      name: "create",
      collection: "@srleecode/domain",
      options: [
        {
          name: "application",
          type: "string",
          description:
            "Application that the new domain libraries will belong to",
          alias: "a",
          "x-prompt":
            "What application will the new domain libraries be under?",
          default: "blog",
        },
        {
          name: "domain",
          type: "string",
          description:
            "Name of the domain. Format is parent-domain/child-domain for child domains and domain/shared for parent domains.",
          alias: "d",
          "x-prompt":
            "What is the name of the domain? Use parent-domain/child-domain format for a child domain. Use domain/shared format for parent domains.",
          default: "new3/",
        },
        {
          name: "prefix",
          type: "string",
          description: "The prefix to apply to generated selectors.",
          alias: "p",
          oneOf: [
            {
              maxLength: 0,
            },
            {
              minLength: 1,
              format: "html-selector",
            },
          ],
          "x-prompt": "What is the prefix to apply to generated selectors?",
          default: "test",
        },
        {
          name: "libraries",
          description: "The library types that will be generated",
          type: "array",
          items: {
            type: "string",
          },
          uniqueItems: true,
          alias: "l",
          default: ["data-access", "feature", "shell", "ui", "util"],
          "x-prompt": {
            message: "Which library types do you want to generate?",
            type: "list",
            "multi-select": true,
            items: [
              {
                value: "data-access",
                label: "data-access - for state management and services",
              },
              {
                value: "feature",
                label: "feature - for smart components (containers)",
              },
              {
                value: "shell",
                label:
                  "shell - for wrapping different libraries and exposing them as a single library. Also, for routing.",
              },
              {
                value: "ui",
                label: "ui - for dumb components",
              },
              {
                value: "util",
                label:
                  "util - for model files, constants, validators, pipes and any other miscellaneous items, e.g. shared functions.",
              },
            ],
          },
        },
        {
          name: "style",
          description: "The file extension to be used for style files.",
          type: "string",
          default: "scss",
          alias: "s",
          "x-prompt": {
            message: "Which stylesheet format would you like to use?",
            type: "list",
            items: [
              {
                value: "css",
                label: "CSS",
              },
              {
                value: "scss",
                label: "SASS(.scss) [http://sass-lang.com]",
              },
              {
                value: "less",
                label: "LESS        [http://lesscss.org]",
              },
            ],
          },
        },
        {
          name: "addJestJunitReporter",
          description: "Add jest junit reporter setup",
          type: "boolean",
          default: false,
          "x-prompt": "Configure jest junit reporter?",
        },
        {
          name: "addE2EProject",
          description: "Add a e2e cypress project",
          type: "boolean",
          default: false,
          "x-prompt": "Add a cypress e2e app?",
        },
        {
          name: "addStorybookProject",
          description: "Add storybook project",
          type: "boolean",
          default: false,
          "x-prompt": "Add a storybook app?",
        },
      ],
      description: "",
      command: "generate",
      positional: "@srleecode/domain:create",
      cliName: "ng",
      contextValues: undefined,
    };
    const message = getCliTaskWithDefaults(taskDefinition, schema);
    expect(message).toEqual({
      command: "generate",
      flags: [
        "--application=blog",
        "--domain=new3/",
        "--prefix=test",
        "--style=scss",
        "--libraries=data-access,feature,shell,ui",
        "--no-interactive",
        "--dry-run",
      ],
      positional: "@srleecode/domain:create",
    });
  });
});
