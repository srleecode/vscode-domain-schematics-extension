import { existsSync } from "fs";
import { dirname, join, parse } from "path";
import {
  Task,
  TaskExecution,
  TaskProvider,
  tasks,
  TaskDefinition,
  TaskScope,
  ProviderResult,
} from "vscode";
import { CliTaskDefinition } from "./cli-task-definition";
import { getShellExecutionForConfig } from "./shell-execution";
import { statSync } from "fs";
import { platform } from "os";
import * as path from "path";
import { workspace } from "vscode";
import { showError } from "../error-utils";
export let cliTaskProvider: CliTaskProvider;

export class CliTaskProvider implements TaskProvider {
  private currentDryRun?: TaskExecution;
  private deferredDryRun?: CliTaskDefinition;
  workspaceJsonPath = "";

  constructor() {
    cliTaskProvider = this;
    const vscodeWorkspacePath =
      workspace.workspaceFolders && workspace.workspaceFolders[0].uri.fsPath;
    if (vscodeWorkspacePath) {
      this.scanForWorkspace(vscodeWorkspacePath);
    }

    tasks.onDidEndTaskProcess(() => {
      this.currentDryRun = undefined;
      if (this.deferredDryRun) {
        this.executeTask(this.deferredDryRun);
        this.deferredDryRun = undefined;
      }
    });
  }

  scanForWorkspace(vscodeWorkspacePath: string) {
    let currentDirectory = vscodeWorkspacePath;

    const { root } = parse(vscodeWorkspacePath);
    while (currentDirectory !== root) {
      if (existsSync(join(currentDirectory, "angular.json"))) {
        return this.setWorkspaceJsonPath(
          join(currentDirectory, "angular.json")
        );
      }
      if (existsSync(join(currentDirectory, "workspace.json"))) {
        return this.setWorkspaceJsonPath(
          join(currentDirectory, "workspace.json")
        );
      }
      currentDirectory = dirname(currentDirectory);
    }
  }

  setWorkspaceJsonPath(workspaceJsonPath: string) {
    this.workspaceJsonPath = workspaceJsonPath;
  }

  provideTasks(): ProviderResult<Task[]> {
    return null;
  }
  resolveTask(task: Task): Task | undefined {
    if (
      this.workspaceJsonPath &&
      task.definition.command &&
      task.definition.project
    ) {
      const cliTask = this.createTask({
        command: task.definition.command,
        positional: task.definition.project,
        flags: Array.isArray(task.definition.flags)
          ? task.definition.flags
          : [],
      });
      // resolveTask requires that the same definition object be used.
      cliTask.definition = task.definition;
      return cliTask;
    }
  }

  private createTask(definition: CliTaskDefinition): Task {
    const useNxCli = this.getWorkspacePath().endsWith("workspace.json");
    const type = useNxCli ? "nx" : "ng";
    const taskDefinition: TaskDefinition = {
      command: definition.command,
      positional: definition.positional,
      flags: definition.flags,
      type,
    };
    const scope = TaskScope.Workspace;
    const name = `${type} ${taskDefinition.command} ${
      taskDefinition.positional
    } ${taskDefinition.flags.join(" ")}`;
    const args = [
      taskDefinition.command,
      taskDefinition.positional,
      ...taskDefinition.flags,
    ];
    const source = "domain-schematics";
    const program = useNxCli
      ? this.findClosestNx(this.getWorkspacePath())
      : this.findClosestNg(this.getWorkspacePath());
    const execution = getShellExecutionForConfig({
      displayCommand: name,
      args,
      cwd: this.getWorkspacePath(),
      name,
      program,
    });
    return new Task(taskDefinition, scope, name, source, execution);
  }

  private getWorkspacePath(): string {
    return join(this.workspaceJsonPath, "..");
  }

  executeTask(definition: CliTaskDefinition) {
    const { validNodeModules: hasNodeModules } = this.verifyNodeModules(
      this.getWorkspacePath()
    );
    if (!hasNodeModules) {
      return;
    }
    const isDryRun = definition.flags.includes("--dry-run");
    if (isDryRun && this.currentDryRun) {
      this.deferredDryRun = definition;
      return;
    }
    const task = this.createTask(definition);
    return tasks.executeTask(task).then((execution) => {
      if (isDryRun) {
        this.currentDryRun = execution;
      }
    });
  }

  private verifyNodeModules(workspacePath: string): {
    validNodeModules: boolean;
  } {
    if (!existsSync(join(workspacePath, "node_modules"))) {
      showError(
        `Could not execute task since node_modules directory is missing. Run npm install at: ${workspacePath}`
      );
      return { validNodeModules: false };
    }

    return { validNodeModules: true };
  }

  private findClosestNg(dir: string): string {
    if (this.directoryExists(path.join(dir, "node_modules"))) {
      if (platform() === "win32") {
        if (this.fileExistsSync(path.join(dir, "ng.cmd"))) {
          return path.join(dir, "ng.cmd");
        } else {
          return path.join(dir, "node_modules", ".bin", "ng.cmd");
        }
      } else {
        if (this.fileExistsSync(path.join(dir, "node_modules", ".bin", "ng"))) {
          return path.join(dir, "node_modules", ".bin", "ng");
        } else {
          return path.join(dir, "node_modules", "@angular", "cli", "bin", "ng");
        }
      }
    } else {
      return this.findClosestNg(path.dirname(dir));
    }
  }

  private findClosestNx(dir: string): string {
    if (this.directoryExists(path.join(dir, "node_modules"))) {
      if (platform() === "win32") {
        if (this.fileExistsSync(path.join(dir, "nx.cmd"))) {
          return path.join(dir, "nx.cmd");
        } else {
          return path.join(dir, "node_modules", ".bin", "nx.cmd");
        }
      } else {
        if (this.fileExistsSync(path.join(dir, "node_modules", ".bin", "nx"))) {
          return path.join(dir, "node_modules", ".bin", "nx");
        } else {
          return path.join(dir, "node_modules", "@nrwl", "cli", "bin", "nx.js");
        }
      }
    } else {
      return this.findClosestNx(path.dirname(dir));
    }
  }

  private directoryExists(filePath: string): boolean {
    try {
      return statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  }

  private fileExistsSync(filePath: string): boolean {
    try {
      return statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  }
}
