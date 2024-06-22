import { expect, test } from "vitest";
// import * as fc from "fast-check";

import { last, last_two } from "../src/main";

test("Return the last element in a given list", () => {
  expect(last([])).toEqual(null);
  expect(last(["a"])).toEqual("a");
  expect(last([1, 2, 3])).toEqual(3);
});

test("Return the last two elements in a given list", () => {
  expect(last_two([])).toEqual(null);
  expect(last_two([true])).toEqual(null);
  expect(last_two(["a", 1])).toEqual(["a", 1]);
  expect(last_two([1, 2, 3])).toEqual([2, 3]);
});
