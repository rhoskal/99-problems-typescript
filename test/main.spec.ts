import { expect, test } from "vitest";
import * as fc from "fast-check";

import {
  last,
  last_two,
  element_at,
  length,
  reverse,
  is_palindrome,
  flatten,
  compress,
  pack,
  encode,
  encode_modified,
  decode_modified,
  encode_direct,
  duplicate,
  replicate,
  drop_every,
  split,
  slice,
  rotate,
  remove_at,
  insert_at,
  range,
  rnd_select,
  lotto_select,
  permutation,
  combination,
} from "../src/main";

test("[01] Return the last element of a list", () => {
  expect(last([])).toEqual(null);
  expect(last(["a"])).toEqual("a");
  expect(last([1, 2, 3])).toEqual(3);
});

test("[02] Return the last two elements of a list", () => {
  expect(last_two([])).toEqual(null);
  expect(last_two([true])).toEqual(null);
  expect(last_two(["a", 1])).toEqual(["a", 1]);
  expect(last_two([1, 2, 3])).toEqual([2, 3]);
});

test("[03] Return nth element of a list", () => {
  expect(element_at(2)([])).toEqual(null);
  expect(element_at(2)([1, 2])).toEqual(2);
  expect(element_at(-2)([1, 2])).toEqual(null);
  expect(element_at(2)(["a", "b", "c", "d", "e"])).toEqual("b");
});

test("[04] Return the length of a list", () => {
  expect(length([])).toEqual(0);
  expect(length([1])).toEqual(1);
  expect(length(["a", "b", "c", "d", "e"])).toEqual(5);
});

test("[05] Return the items of a list reversed", () => {
  expect(reverse([])).toEqual([]);
  expect(reverse([1])).toEqual([1]);
  expect(reverse([1, 2, 3])).toEqual([3, 2, 1]);
});

test("[06] Return the items of a list reversed", () => {
  expect(is_palindrome([])).toBe(true);
  expect(is_palindrome([1])).toBe(true);
  expect(is_palindrome([1, 2, 3])).toBe(false);
  expect(is_palindrome(["a", "b", "a"])).toBe(true);
  expect(is_palindrome([1, 2, 2, 1])).toBe(true);
  expect(is_palindrome(["x", "a", "m", "a", "x"])).toBe(true);
  expect(is_palindrome([1, 2, 4, 8, 16, 8, 4, 2, 1])).toBe(true);
});

test("[07] Return a flattened list", () => {
  expect(flatten([1, [2, 3]])).toStrictEqual([1, 2, 3]);
  expect(flatten([[2, 3], 1])).toStrictEqual([2, 3, 1]);
  expect(flatten(["a", ["b", ["c", "d"], "e"]])).toStrictEqual(["a", "b", "c", "d", "e"]);
  expect(flatten([[["a"]]])).toStrictEqual(["a"]);
});

test("[08] Remove consecutive duplicates", () => {
  expect(compress(["a", "a", "b", "c", "c"])).toStrictEqual(["a", "b", "c"]);
  expect(
    compress(["a", "a", "a", "a", "b", "c", "c", "a", "a", "d", "e", "e", "e", "e"]),
  ).toStrictEqual(["a", "b", "c", "a", "d", "e"]);
});

test("[09] Pack/combine duplicates", () => {
  expect(pack(["a", "a", "b", "c", "c"])).toStrictEqual(["aa", "b", "cc"]);
  expect(
    pack(["a", "a", "a", "a", "b", "c", "c", "a", "a", "d", "e", "e", "e", "e"]),
  ).toStrictEqual(["aaaa", "b", "cc", "aa", "d", "eeee"]);
});

test("[10] Encode duplicates", () => {
  expect(encode(["a", "a", "b", "c", "c"])).toStrictEqual([
    [2, "a"],
    [1, "b"],
    [2, "c"],
  ]);
  expect(
    encode(["a", "a", "a", "a", "b", "c", "c", "a", "a", "d", "e", "e", "e", "e"]),
  ).toStrictEqual([
    [4, "a"],
    [1, "b"],
    [2, "c"],
    [2, "a"],
    [1, "d"],
    [4, "e"],
  ]);
});

test("[11] Encode duplicates but modified", () => {
  expect(
    encode_modified(["a", "a", "a", "a", "b", "c", "c", "a", "a", "d", "e", "e", "e", "e"]),
  ).toStrictEqual([
    { _kind: "multiple_encode", value: "a", count: 4 },
    { _kind: "single_encode", value: "b" },
    { _kind: "multiple_encode", value: "c", count: 2 },
    { _kind: "multiple_encode", value: "a", count: 2 },
    { _kind: "single_encode", value: "d" },
    { _kind: "multiple_encode", value: "e", count: 4 },
  ]);
});

test("[12] Decode encoded duplicates", () => {
  expect(
    decode_modified([
      { _kind: "multiple_encode", value: "a", count: 4 },
      { _kind: "single_encode", value: "b" },
      { _kind: "multiple_encode", value: "c", count: 2 },
      { _kind: "multiple_encode", value: "a", count: 2 },
      { _kind: "single_encode", value: "d" },
      { _kind: "multiple_encode", value: "e", count: 4 },
    ]),
  ).toStrictEqual("aaaabccaadeeee");
});

test("[13] Encode duplicates directly", () => {
  expect(
    encode_direct(["a", "a", "a", "a", "b", "c", "c", "a", "a", "d", "e", "e", "e", "e"]),
  ).toStrictEqual([
    { _kind: "multiple_encode", value: "a", count: 4 },
    { _kind: "single_encode", value: "b" },
    { _kind: "multiple_encode", value: "c", count: 2 },
    { _kind: "multiple_encode", value: "a", count: 2 },
    { _kind: "single_encode", value: "d" },
    { _kind: "multiple_encode", value: "e", count: 4 },
  ]);
});

test("[14] Duplicate items in a list", () => {
  expect(duplicate(["a", "b", "c", "c", "d"])).toStrictEqual([
    "a",
    "a",
    "b",
    "b",
    "c",
    "c",
    "c",
    "c",
    "d",
    "d",
  ]);
  expect(duplicate([1, 2, 3])).toStrictEqual([1, 1, 2, 2, 3, 3]);
});

test("[15] Duplicate items in a list", () => {
  expect(replicate(3)(["a", "b", "c"])).toStrictEqual([
    "a",
    "a",
    "a",
    "b",
    "b",
    "b",
    "c",
    "c",
    "c",
  ]);
  expect(replicate(2)([1, 2, 3])).toStrictEqual([1, 1, 2, 2, 3, 3]);
});

test("[16] Drop every nth item from a list", () => {
  expect(drop_every(3)(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"])).toStrictEqual([
    "a",
    "b",
    "d",
    "e",
    "g",
    "h",
    "j",
    "k",
  ]);
});

test("[17] Split a given list into 2 parts", () => {
  expect(split(3)(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"])).toStrictEqual({
    left: ["a", "b", "c"],
    right: ["d", "e", "f", "g", "h", "i", "j", "k"],
  });
});

test("[18] Slice a list", () => {
  expect(slice(3, 7)(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"])).toStrictEqual([
    "c",
    "d",
    "e",
    "f",
    "g",
  ]);
  expect(slice(3, 5)([1, 2, 3, 4, 5])).toStrictEqual([3, 4, 5]);
});

test("[19] Rotate a list", () => {
  expect(rotate(3)(["a", "b", "c", "d", "e", "f", "g", "h"])).toStrictEqual([
    "d",
    "e",
    "f",
    "g",
    "h",
    "a",
    "b",
    "c",
  ]);
  expect(rotate(-2)(["a", "b", "c", "d", "e", "f", "g", "h"])).toStrictEqual([
    "g",
    "h",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ]);
});

test("[20] Remove nth element", () => {
  expect(remove_at(1)(["a", "b", "c", "d"])).toStrictEqual(["a", "c", "d"]);
  expect(remove_at(3)(["a", "b", "c", "d"])).toStrictEqual(["a", "b", "c"]);
});

test("[21] Insert at nth position", () => {
  expect(insert_at("alfa")(1)(["a", "b", "c", "d"])).toStrictEqual(["a", "alfa", "b", "c", "d"]);
  expect(insert_at("alfa")(5)(["a", "b", "c", "d"])).toStrictEqual(["a", "b", "c", "d", "alfa"]);
});

test("[22] Range operator", () => {
  expect(range(4, 9)).toStrictEqual([4, 5, 6, 7, 8, 9]);
});

test("[23] Random selection", () => {
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 8 }), (num) => {
      const randoms = rnd_select(num)(["a", "b", "c", "d", "e", "f", "g", "h"]);

      expect(randoms.length).toEqual(num);
    }),
  );
});

test("[24] Lotto random selection", () => {
  fc.assert(
    fc.property(fc.integer({ min: 2, max: 20 }), (num) => {
      const randoms = lotto_select(1, num);

      // since we're asked to make `lotto_select` choose a random number of numbers
      // from the desired range, there really isn't a good way to test the result.
      // all we know for sure is that there must be at least 1 random returned
      expect(randoms.length > 0 && randoms.length <= 20).toBe(true);
    }),
  );
});

test("[25] Generate random permutation", () => {
  const randoms = permutation(["a", "b", "c", "d", "e", "f"]);

  expect(randoms.length).toBe(6);
});

test.skip("[26] Generate combinations", () => {
  expect(combination(1)(["a", "b", "c", "d"])).toStrictEqual(["a", "b", "c", "d"]);
  expect(combination(2)(["a", "b", "c", "d"])).toStrictEqual([]);
});

test.skip("[27a]", () => {});

test.skip("[27b]", () => {});

test.skip("[28a]", () => {});

test.skip("[28b]", () => {});
