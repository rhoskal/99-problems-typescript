import { expect, test } from "vitest";
// import * as fc from "fast-check";

import { last, last_two, nth, length } from "../src/main";

test("Return the last element of a list", () => {
  expect(last([])).toEqual(null);
  expect(last(["a"])).toEqual("a");
  expect(last([1, 2, 3])).toEqual(3);
});

test("Return the last two elements of a list", () => {
  expect(last_two([])).toEqual(null);
  expect(last_two([true])).toEqual(null);
  expect(last_two(["a", 1])).toEqual(["a", 1]);
  expect(last_two([1, 2, 3])).toEqual([2, 3]);
});

test("Return nth element of a list", () => {
  expect(nth(2)([])).toEqual(null);
  expect(nth(2)([1, 2])).toEqual(2);
  expect(nth(-2)([1, 2])).toEqual(null);
  expect(nth(2)(["a", "b", "c", "d", "e"])).toEqual("b");
});

test("Return the length of a list", () => {
  expect(length([])).toEqual(0);
  expect(length([1])).toEqual(1);
  expect(length(["a", "b", "c", "d", "e"])).toEqual(5);
});
