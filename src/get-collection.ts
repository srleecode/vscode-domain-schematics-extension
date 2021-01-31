import { DomainAction } from "./model/domain-action";

export const getCollection = (
  action: DomainAction,
  defaultCollection: string
): string => {
  switch (action) {
    case DomainAction.addNgrxAction:
    case DomainAction.addNgrxEffect:
    case DomainAction.addNgrxEntity:
    case DomainAction.addNgrxFeature:
    case DomainAction.addNgrxSelector:
    case DomainAction.addNgrxStore:
    case DomainAction.addNgrxReducer:
      return "@ngrx/schematics";
    default:
      return defaultCollection;
  }
};
