import { expect, test } from "vitest";
// import * as fc from "fast-check";

import {
  last,
  last_two,
  nth,
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
} from "../src/main";

test("[1] Return the last element of a list", () => {
  expect(last([])).toEqual(null);
  expect(last(["a"])).toEqual("a");
  expect(last([1, 2, 3])).toEqual(3);
});

test("[2] Return the last two elements of a list", () => {
  expect(last_two([])).toEqual(null);
  expect(last_two([true])).toEqual(null);
  expect(last_two(["a", 1])).toEqual(["a", 1]);
  expect(last_two([1, 2, 3])).toEqual([2, 3]);
});

test("[3] Return nth element of a list", () => {
  expect(nth(2)([])).toEqual(null);
  expect(nth(2)([1, 2])).toEqual(2);
  expect(nth(-2)([1, 2])).toEqual(null);
  expect(nth(2)(["a", "b", "c", "d", "e"])).toEqual("b");
});

test("[4] Return the length of a list", () => {
  expect(length([])).toEqual(0);
  expect(length([1])).toEqual(1);
  expect(length(["a", "b", "c", "d", "e"])).toEqual(5);
});

test("[5] Return the items of a list reversed", () => {
  expect(reverse([])).toEqual([]);
  expect(reverse([1])).toEqual([1]);
  expect(reverse([1, 2, 3])).toEqual([3, 2, 1]);
});

test("[6] Return the items of a list reversed", () => {
  expect(is_palindrome([])).toBe(true);
  expect(is_palindrome([1])).toBe(true);
  expect(is_palindrome([1, 2, 3])).toBe(false);
  expect(is_palindrome(["a", "b", "a"])).toBe(true);
  expect(is_palindrome([1, 2, 2, 1])).toBe(true);
  expect(is_palindrome(["x", "a", "m", "a", "x"])).toBe(true);
  expect(is_palindrome([1, 2, 4, 8, 16, 8, 4, 2, 1])).toBe(true);
});

test("[7] Return a flattened list", () => {
  expect(flatten([1, [2, 3]])).toStrictEqual([1, 2, 3]);
  expect(flatten([[2, 3], 1])).toStrictEqual([2, 3, 1]);
  expect(flatten(["a", ["b", ["c", "d"], "e"]])).toStrictEqual(["a", "b", "c", "d", "e"]);
  expect(flatten([[["a"]]])).toStrictEqual(["a"]);
});

test("[8] Remove consecutive duplicates", () => {
  expect(compress(["a", "a", "b", "c", "c"])).toStrictEqual(["a", "b", "c"]);
  expect(
    compress(["a", "a", "a", "a", "b", "c", "c", "a", "a", "d", "e", "e", "e", "e"]),
  ).toStrictEqual(["a", "b", "c", "a", "d", "e"]);
});

test("[9] Pack/combine duplicates", () => {
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
