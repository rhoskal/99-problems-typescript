import { expect, test } from "vitest";
// import * as fc from "fast-check";

import { last } from "../src/main";

test("Return the last element in a given list", () => {
  expect(last([])).toEqual(null);
  expect(last(["a"])).toEqual("a");
  expect(last([1, 2, 3])).toEqual(3);
});
