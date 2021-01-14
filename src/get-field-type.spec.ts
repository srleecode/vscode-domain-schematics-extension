import { getFieldType } from "./get-field-type";
import { OptionComponent } from "./model/option-component.enum";
import { LongFormXPrompt } from "./model/x-prompt.model";

describe("fieldType", () => {
  const mockOption: any = {
    name: "style",
    description: "The file extension to be used for style files.",
    type: "string",
    aliases: [],
  };
  it("should set field type as Input when option has no enum and type is not boolean", () => {
    expect(getFieldType(mockOption)).toBe(OptionComponent.Input);
  });
  it("should set field type as Autocomplete when number of enum options is greater than 10", () => {
    const option = {
      ...mockOption,
      enum: [...Array(11).keys()],
    };
    expect(getFieldType(option)).toBe(OptionComponent.Autocomplete);
  });
  it("should set field type as Select when number of enum options is less than or equal to 10", () => {
    const option = {
      ...mockOption,
      enum: [...Array(10).keys()],
    };
    expect(getFieldType(option)).toBe(OptionComponent.Select);
  });
  it("should set field type as MultiSelect when x-prompt has options and multi is true", () => {
    const xPrompt: LongFormXPrompt = {
      message: "",
      type: "list",
      multiselect: true,
    };
    const option = {
      ...mockOption,
      "x-prompt": xPrompt,
    };
    expect(getFieldType(option)).toBe(OptionComponent.MultiSelect);
  });
  it("should set field type as Checkbox when option type is boolean", () => {
    const option = {
      ...mockOption,
      type: "boolean",
    };

    expect(getFieldType(option)).toBe(OptionComponent.Checkbox);
  });
});
