// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  WebviewPanel,
  ExtensionContext,
  extensions,
  window,
  commands,
  Uri,
  Extension,
} from "vscode";
import { getCommandTriggerContext } from "./get-command-trigger-context";
import { CliTaskProvider } from "./nx-console/cli-task-provider";
import { revealWebViewPanel } from "./nx-console/webview";
import { DomainAction } from "./model/domain-action";
import { Command } from "./model/command";
import { showError } from "./error-utils";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "domain-schematics" is now active!'
  );
  const taskProvider = new CliTaskProvider();
  const nxConsole = extensions.getExtension("nrwl.angular-console");
  if (nxConsole === undefined) {
    showError("Nx console should be installed");
  } else if (nxConsole?.isActive === false) {
    nxConsole.activate();
  }

  const registerCommand = (
    name: string,
    action: DomainAction,
    type: Command
  ) => {
    const command = commands.registerCommand(name, (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          action,
          type,
          getCommandTriggerContext(e)
        );
      }
    });
    context.subscriptions.push(command);
  };
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  registerCommand(
    "domain-schematics.createDomain",
    DomainAction.createDomain,
    Command.generate
  );
  registerCommand(
    "domain-schematics.moveDomain",
    DomainAction.moveDomain,
    Command.generate
  );
  registerCommand(
    "domain-schematics.removeDomain",
    DomainAction.removeDomain,
    Command.generate
  );
  registerCommand(
    "domain-schematics.createCypressProject",
    DomainAction.createCypressProject,
    Command.generate
  );
  registerCommand(
    "domain-schematics.removeCypressProject",
    DomainAction.removeCypressProject,
    Command.generate
  );
  registerCommand(
    "domain-schematics.addLibraries",
    DomainAction.addLibraries,
    Command.generate
  );
  registerCommand(
    "domain-schematics.removeLibraries",
    DomainAction.removeLibraries,
    Command.generate
  );
  registerCommand(
    "domain-schematics.runLint",
    DomainAction.runLint,
    Command.run
  );
  registerCommand(
    "domain-schematics.runTests",
    DomainAction.runTests,
    Command.run
  );
  registerCommand(
    "domain-schematics.runStorybook",
    DomainAction.runStorybook,
    Command.run
  );
  registerCommand(
    "domain-schematics.runStorybookTests",
    DomainAction.runStorybookTests,
    Command.run
  );
  registerCommand(
    "domain-schematics.runE2ETests",
    DomainAction.runE2ETests,
    Command.run
  );
  registerCommand(
    "domain-schematics.addComponent",
    DomainAction.addComponent,
    Command.generate
  );
  registerCommand(
    "domain-schematics.ngrxAction",
    DomainAction.addNgrxAction,
    Command.generate
  );
  registerCommand(
    "domain-schematics.ngrxEffect",
    DomainAction.addNgrxEffect,
    Command.generate
  );
  registerCommand(
    "domain-schematics.ngrxEntity",
    DomainAction.addNgrxEntity,
    Command.generate
  );
  registerCommand(
    "domain-schematics.ngrxFeature",
    DomainAction.addNgrxFeature,
    Command.generate
  );
  registerCommand(
    "domain-schematics.ngrxSelector",
    DomainAction.addNgrxSelector,
    Command.generate
  );
  registerCommand(
    "domain-schematics.ngrxStore",
    DomainAction.addNgrxStore,
    Command.generate
  );
  registerCommand(
    "domain-schematics.ngrxReducer",
    DomainAction.addNgrxReducer,
    Command.generate
  );
}
// this method is called when your extension is deactivated
export function deactivate() {}
