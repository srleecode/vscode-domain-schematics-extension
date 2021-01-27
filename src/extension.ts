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

let webviewPanel: WebviewPanel | undefined;

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

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let createDomainCommand = commands.registerCommand(
    "domain-schematics.createDomain",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.createDomain,
          Command.generate,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let moveDomainCommand = commands.registerCommand(
    "domain-schematics.moveDomain",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.moveDomain,
          Command.generate,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let removeDomainCommand = commands.registerCommand(
    "domain-schematics.removeDomain",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.removeDomain,
          Command.generate,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let createCypressProjectCommand = commands.registerCommand(
    "domain-schematics.createCypressProject",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.createCypressProject,
          Command.generate,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let removeCypressProjectCommand = commands.registerCommand(
    "domain-schematics.removeCypressProject",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.removeCypressProject,
          Command.generate,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let addLibrariesCommand = commands.registerCommand(
    "domain-schematics.addLibraries",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.addLibraries,
          Command.generate,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let removeLibrariesCommand = commands.registerCommand(
    "domain-schematics.removeLibraries",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.removeLibraries,
          Command.generate,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let runLintCommand = commands.registerCommand(
    "domain-schematics.runLint",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.runLint,
          Command.run,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let runTestsCommand = commands.registerCommand(
    "domain-schematics.runTests",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.runTests,
          Command.run,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let runStorybookCommand = commands.registerCommand(
    "domain-schematics.runStorybook",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.runStorybook,
          Command.run,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let runStorybookTestsCommand = commands.registerCommand(
    "domain-schematics.runStorybookTests",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.runStorybookTests,
          Command.run,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let runE2ETestsCommand = commands.registerCommand(
    "domain-schematics.runE2ETests",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.runE2ETests,
          Command.run,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  let addComponentCommand = commands.registerCommand(
    "domain-schematics.addComponent",
    (e: Uri) => {
      if (!!nxConsole) {
        revealWebViewPanel(
          context,
          nxConsole?.extensionPath,
          taskProvider,
          DomainAction.addComponent,
          Command.generate,
          getCommandTriggerContext(e)
        );
      }
    }
  );

  context.subscriptions.push(createDomainCommand);
  context.subscriptions.push(moveDomainCommand);
  context.subscriptions.push(removeDomainCommand);
  context.subscriptions.push(createCypressProjectCommand);
  context.subscriptions.push(removeCypressProjectCommand);
  context.subscriptions.push(addLibrariesCommand);
  context.subscriptions.push(removeLibrariesCommand);
  context.subscriptions.push(runLintCommand);
  context.subscriptions.push(runTestsCommand);
  context.subscriptions.push(runStorybookCommand);
  context.subscriptions.push(runStorybookTestsCommand);
  context.subscriptions.push(runE2ETestsCommand);
  context.subscriptions.push(addComponentCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
