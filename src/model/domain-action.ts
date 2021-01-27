export enum DomainAction {
  createDomain = "createDomain",
  moveDomain = "moveDomain",
  removeDomain = "removeDomain",
  createCypressProject = "createCypressProject",
  removeCypressProject = "removeCypressProject",
  addLibraries = "addLibraries",
  removeLibraries = "removeLibraries",
  runLint = "runLint",
  runTests = "runTests",
  runStorybook = "runStorybook",
  runStorybookTests = "runStorybookTests",
  runE2ETests = "runE2ETests",
  addComponent = "addComponent",
}

export const getDomainActionName = (action: DomainAction): string => {
  switch (action) {
    case DomainAction.createDomain:
      return "create";
    case DomainAction.moveDomain:
      return "move";
    case DomainAction.removeDomain:
      return "remove";
    case DomainAction.createCypressProject:
      return "addCypressProject";
    case DomainAction.removeCypressProject:
      return "removeCypressProject";
    case DomainAction.addLibraries:
      return "addLibraries";
    case DomainAction.removeLibraries:
      return "removeLibraries";
    case DomainAction.runLint:
      return "lint";
    case DomainAction.runTests:
      return "test";
    case DomainAction.runStorybook:
      return "storybook";
    case DomainAction.runStorybookTests:
      return "storybook-e2e";
    case DomainAction.runE2ETests:
      return "e2e";
    case DomainAction.addComponent: {
      return "addComponent";
    }
  }
};
