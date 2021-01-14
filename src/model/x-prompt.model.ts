export type XPrompt = string | LongFormXPrompt;
export interface LongFormXPrompt {
  message: string;
  type: "confirmation" | "input" | "list";
  multiselect?: boolean;
  items?: (string | OptionItemLabelValue)[];
}

export interface OptionItemLabelValue {
  label: string;
  value: string;
}

export const isLongFormXPrompt = (
  xPrompt: XPrompt
): xPrompt is LongFormXPrompt =>
  (xPrompt as Partial<LongFormXPrompt>).message !== undefined;

export const isOptionItemLabelValue = (
  item: string | OptionItemLabelValue
): item is OptionItemLabelValue =>
  (item as Partial<OptionItemLabelValue>).value !== undefined ||
  (item as Partial<OptionItemLabelValue>).label !== undefined;
