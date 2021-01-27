jest.mock("vscode", () => {}, { virtual: true });
import { CommandTriggerContext } from "./get-command-trigger-context";
import { getSchematicTaskExecutionSchema } from "./get-schematic-task-execution-schema";
import { TaskExecutionSchema } from "./nx-console/task-execution-schema";
import { DomainAction } from "./model/domain-action";
import * as extensionConfig from "./get-extension-configuration";
import { Command } from "./model/command";
import { ExtensionConfiguration } from "./model/extension-configuration";
import * as schemaUtils from "./schema-utils";
import { schemaMock } from "./model/schema-mock.const";
import { ItemTooltips } from "./model/item-tooltips.model";

describe("getSchematicTaskExecutionSchema", () => {
  const commandTriggerContext: CommandTriggerContext = {
    application: "application",
  };
  const extensionConfiguration: ExtensionConfiguration = {
    style: "scss",
    prefix: "testPrefix",
    collection: "@srleecode/domain",
    lint: "eslint",
    addJestJunitReporter: true,
    uiFramework: "@storybook/angular",
    displayBlock: true,
    isExported: true,
    buildable: true,
    enableIvy: true,
    strict: true,
    publishable: false,
  };
  const getSelectedOption = (options: any[] | undefined, optionName: string) =>
    (options || []).filter((option) => option.name === optionName)[0];

  const getOptionDefaultValue = (
    options: any[] | undefined,
    optionName: string
  ) => getSelectedOption(options, optionName)?.default;

  beforeAll(() =>
    jest.spyOn(schemaUtils, "getSchemaJson").mockReturnValue(schemaMock)
  );
  describe("generate", () => {
    beforeAll(() =>
      jest
        .spyOn(extensionConfig, "getExtensionConfiguration")
        .mockReturnValue(extensionConfiguration)
    );

    it("should set cliName to nx when there is a workspace.json", () => {
      const schema = getSchematicTaskExecutionSchema(
        DomainAction.createDomain,
        Command.generate,
        "workspace.json",
        commandTriggerContext
      );
      expect(schema?.cliName).toBe("nx");
    });
    describe("common across all schematics", () => {
      let schema: TaskExecutionSchema | undefined;
      beforeAll(() => {
        schema = getSchematicTaskExecutionSchema(
          DomainAction.createDomain,
          Command.generate,
          "",
          commandTriggerContext
        );
      });
      it("should set collection to @srleecode/domain", () => {
        expect(schema?.collection).toBe("@srleecode/domain");
      });
      it("should set command to generate", () => {
        expect(schema?.command).toBe("generate");
      });
      it("should set cliName to ng when workspace.json is not found", () => {
        expect(schema?.cliName).toBe("ng");
      });
      it("should set items when schema option has enum values", () => {
        expect(
          getSelectedOption(schema?.options, "uiFramework").items
        ).toEqual(["@storybook/angular", "@storybook/react"]);
      });
      describe("xPrompt", () => {
        it("should set tooltip when option has short form xPrompt", async () => {
          expect(
            getSelectedOption(schema?.options, "application").tooltip
          ).toBe(schemaMock.properties.application["x-prompt"]);
        });

        it("should set tooltip when option has long form xPrompt", async () => {
          expect(getSelectedOption(schema?.options, "libraries").tooltip).toBe(
            schemaMock.properties.libraries["x-prompt"].message
          );
        });

        it("should set enumTooltips when x-prompt has items and labels", async () => {
          const tooltips: ItemTooltips = {};
          schemaMock.properties.libraries["x-prompt"].items.forEach(
            (item) => (tooltips[item.value] = item.label)
          );
          expect(
            getSelectedOption(schema?.options, "libraries").itemTooltips
          ).toEqual(tooltips);
        });
        it("should set items from xPrompt items with label and value when enum is not provided", async () => {
          const xPromptValues = schemaMock.properties.style[
            "x-prompt"
          ].items.map((item) => item.value);
          expect(getSelectedOption(schema?.options, "style").items).toEqual(
            xPromptValues
          );
        });
        it("should use given items when option has items property", async () => {
          expect(getSelectedOption(schema?.options, "libraries").items).toEqual(
            schemaMock.properties.libraries.items
          );
        });
      });
    });
    describe("triggered from application", () => {
      let schema: TaskExecutionSchema | undefined;
      beforeAll(() => {
        schema = getSchematicTaskExecutionSchema(
          DomainAction.createDomain,
          Command.generate,
          "",
          commandTriggerContext
        );
      });
      it("should set collection to create", () => {
        expect(schema?.name).toBe("create");
      });
      it("should set positional to @srleecode/domain:create", () => {
        expect(schema?.positional).toBe("@srleecode/domain:create");
      });
      it("should set default in application option using command execution context application", () => {
        expect(getOptionDefaultValue(schema?.options, "application")).toBe(
          commandTriggerContext.application
        );
      });
      it("should not set default in domain option when application is the trigger context", () => {
        expect(
          getOptionDefaultValue(schema?.options, "domain")
        ).toBeUndefined();
      });
      it("should set default in style option using extension configuration style", () => {
        expect(getOptionDefaultValue(schema?.options, "style")).toBe(
          extensionConfiguration.style
        );
      });
      it("should set default in prefix option using extension configuration prefix", () => {
        expect(getOptionDefaultValue(schema?.options, "prefix")).toBe(
          extensionConfiguration.prefix
        );
      });
      it("should set default in addJestJunitReporter option using extension configuration addJestJunitReporter", () => {
        expect(
          getOptionDefaultValue(schema?.options, "addJestJunitReporter")
        ).toBe(extensionConfiguration.addJestJunitReporter);
      });
    });
  });
});
