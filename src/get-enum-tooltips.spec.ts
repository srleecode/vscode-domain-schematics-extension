import { getEnumTooltips } from "./get-enum-tooltips";
import { LongFormXPrompt } from "./model/x-prompt.model";

describe("getEnumTooltips", () => {
  const xPromptItems = [
    { value: "css", label: "CSS" },
    {
      value: "scss",
      label: "SASS(.scss) [http://sass-lang.com]",
    },
    {
      value: "less",
      label: "LESS        [http://lesscss.org]",
    },
  ];

  it("should set enumTooltips when x-prompt has items and labels", async () => {
    const xPrompt: LongFormXPrompt = {
      message: "Which stylesheet format would you like to use?",
      type: "list",
      items: xPromptItems,
    };
    expect(getEnumTooltips(xPrompt)).toEqual({
      css: xPromptItems[0].label,
      scss: xPromptItems[1].label,
      less: xPromptItems[2].label,
    });
  });
});
