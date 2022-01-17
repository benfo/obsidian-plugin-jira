import { cleanStores, keepMount } from "nanostores";
import { generateKey } from "../../src/stores/queryStore";

describe("generateKey", () => {
  it("should concatenate values", () => {
    const key = generateKey(["a", "b"]);
    expect(key).toBe("a-b");
  });

  it.each([
    [["a", "b"], "a-b"],
    [["b", "a"], "a-b"],
  ])("should sort keys %p", (keys, expected) => {
    const key = generateKey(keys);
    expect(key).toBe(expected);
  });
});
