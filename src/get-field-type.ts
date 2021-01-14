import { OptionComponent } from "./model/option-component.enum";
import { XPrompt, isLongFormXPrompt } from "./model/x-prompt.model";

export const getFieldType = (option: any): OptionComponent => {
  const xPrompt: XPrompt = option["x-prompt"];
  if (
    !!xPrompt &&
    isLongFormXPrompt(xPrompt) &&
    xPrompt.type === "list" &&
    xPrompt.multiselect
  ) {
    return OptionComponent.MultiSelect;
  }
  if (option.enum) {
    return option.enum.length > 10
      ? OptionComponent.Autocomplete
      : OptionComponent.Select;
  } else if (option.type === "boolean") {
    return OptionComponent.Checkbox;
  }
  return OptionComponent.Input;
};
