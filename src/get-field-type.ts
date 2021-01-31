import { OptionComponent } from "./model/option-component.enum";
import {
  XPrompt,
  isLongFormXPrompt,
  LongFormXPrompt,
} from "./model/x-prompt.model";

export const getFieldType = (option: any): OptionComponent => {
  const xPrompt: XPrompt = option["x-prompt"];
  if (
    !!xPrompt &&
    isLongFormXPrompt(xPrompt) &&
    xPrompt.type === "list" &&
    xPrompt.multiselect
  ) {
    return OptionComponent.multiSelect;
  }
  const values = option.enum || (xPrompt && (xPrompt as LongFormXPrompt).items);
  if (values) {
    return values.length > 10
      ? OptionComponent.autocomplete
      : OptionComponent.select;
  } else if (option.type === "boolean") {
    return OptionComponent.checkbox;
  }
  return OptionComponent.input;
};
