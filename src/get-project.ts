import { CommandTriggerContext } from "./get-command-trigger-context";

export const getProject = (
  commandTriggerContext: CommandTriggerContext
): string => {
  const {
    application,
    childDomain,
    topLevelDomain,
    library,
    cypressFolder,
  } = commandTriggerContext;
  if (cypressFolder) {
    const cypressPrefix = cypressFolder === "cypress" ? "e2e" : cypressFolder;
    return childDomain
      ? `${cypressPrefix}-${application}-${topLevelDomain}-${childDomain}`
      : `${cypressPrefix}-${application}-${topLevelDomain}`;
  }
  return childDomain
    ? `${application}-${topLevelDomain}-${childDomain}-${library}`
    : `${application}-${topLevelDomain}-${library}`;
};
