import {
  isLongFormXPrompt,
  isOptionItemLabelValue,
  LongFormXPrompt,
  OptionItemLabelValue,
} from "./x-prompt.model";

describe("x-prompt", () => {
  describe("isLongFormXPrompt", () => {
    const xPrompt: LongFormXPrompt = {
      message: "",
      type: "list",
      multiselect: true,
    };
    it("should return true when long form x prompt", () => {
      expect(isLongFormXPrompt(xPrompt)).toBe(true);
    });
  });
  describe("isOptionItemLabelValue", () => {
    const labelValue: OptionItemLabelValue = {
      label: "test",
      value: "test",
    };
    it("should return true when option item label value", () => {
      expect(isOptionItemLabelValue(labelValue)).toBe(true);
    });
  });
});
