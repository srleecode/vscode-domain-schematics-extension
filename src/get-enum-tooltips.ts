import { ItemTooltips } from "./model/item-tooltips.model";
import {
  XPrompt,
  isLongFormXPrompt,
  isOptionItemLabelValue,
} from "./model/x-prompt.model";

export const getEnumTooltips = (xPrompt: XPrompt): ItemTooltips => {
  const enumTooltips: ItemTooltips = {};
  if (!!xPrompt && isLongFormXPrompt(xPrompt)) {
    (xPrompt.items || []).forEach((item) => {
      if (isOptionItemLabelValue(item) && !!item.label) {
        enumTooltips[item.value] = item.label;
      }
    });
  }
  return enumTooltips;
};
