import { getDomainActionName, DomainAction } from "./domain-action";

describe("getSchematic", () => {
  it("should return create for createDomain", () => {
    expect(getDomainActionName(DomainAction.createDomain)).toBe("create");
  });
});
