import { assert } from "chai";
import countTokens from "../src/utils/countTokens";

describe("counter", () => {
  it("should count the number of tokens in a string", () => {
    const result = countTokens("test test test");
    assert.equal(result, 3);
    assert.notEqual(result, 4);
  });
});
