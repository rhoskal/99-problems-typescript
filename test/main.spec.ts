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
  rnd_permutations,
  combinations,
  group3,
  group,
  lsort,
  lfsort,
  is_prime,
  gcd,
  coprime,
  totient_phi,
  prime_factors,
  prime_factors_mult,
  phi,
  timeit,
  primes_from,
  goldbach,
  goldbach_list,
  table,
  gray,
  huffman,
  is_tree,
} from "../src/main";
import * as Bool from "../src/bool";

test("[01] Should return the last element of a list", () => {
  expect(last([])).toEqual(null);
  expect(last(["a"])).toEqual("a");
  expect(last([1, 2, 3])).toEqual(3);
});

test("[02] Should return the last two elements of a list", () => {
  expect(last_two([])).toEqual(null);
  expect(last_two([true])).toEqual(null);
  expect(last_two(["a", 1])).toEqual(["a", 1]);
  expect(last_two([1, 2, 3])).toEqual([2, 3]);
});

test("[03] Should return nth element of a list", () => {
  expect(element_at(-2)([1, 2])).toEqual(null);
  expect(element_at(0)([1, 2])).toEqual(null);
  expect(element_at(2)([])).toEqual(null);
  expect(element_at(2)([1, 2])).toEqual(2);
  expect(element_at(2)(["a", "b", "c", "d", "e"])).toEqual("b");
});

test("[04] Should return the length of a list", () => {
  expect(length([])).toEqual(0);
  expect(length([1])).toEqual(1);
  expect(length(["a", "b", "c", "d", "e"])).toEqual(5);
});

test("[05] Should return the items of a list reversed", () => {
  expect(reverse([])).toEqual([]);
  expect(reverse([1])).toEqual([1]);
  expect(reverse([1, 2, 3])).toEqual([3, 2, 1]);
});

test("[06] Should return the items of a list reversed", () => {
  expect(is_palindrome([])).toBe(true);
  expect(is_palindrome([1])).toBe(true);
  expect(is_palindrome([1, 2, 3])).toBe(false);
  expect(is_palindrome(["a", "b", "a"])).toBe(true);
  expect(is_palindrome([1, 2, 2, 1])).toBe(true);
  expect(is_palindrome(["x", "a", "m", "a", "x"])).toBe(true);
  expect(is_palindrome([1, 2, 4, 8, 16, 8, 4, 2, 1])).toBe(true);
});

test("[07] Should return a flattened list", () => {
  expect(flatten([1, [2, 3]])).toStrictEqual([1, 2, 3]);
  expect(flatten([[2, 3], 1])).toStrictEqual([2, 3, 1]);
  expect(flatten(["a", ["b", ["c", "d"], "e"]])).toStrictEqual(["a", "b", "c", "d", "e"]);
  expect(flatten([[["a"]]])).toStrictEqual(["a"]);
});

test("[08] Should remove consecutive duplicates", () => {
  expect(compress(["a", "a", "b", "c", "c"])).toStrictEqual(["a", "b", "c"]);
  expect(
    compress(["a", "a", "a", "a", "b", "c", "c", "a", "a", "d", "e", "e", "e", "e"]),
  ).toStrictEqual(["a", "b", "c", "a", "d", "e"]);
});

test("[09] Should pack/combine duplicates", () => {
  expect(pack(["a", "a", "b", "c", "c"])).toStrictEqual(["aa", "b", "cc"]);
  expect(
    pack(["a", "a", "a", "a", "b", "c", "c", "a", "a", "d", "e", "e", "e", "e"]),
  ).toStrictEqual(["aaaa", "b", "cc", "aa", "d", "eeee"]);
});

test("[10] Should encode duplicates", () => {
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

test("[11] Should encode duplicates but modified", () => {
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

test("[12] Should decode encoded duplicates", () => {
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

test("[13] Should encode duplicates directly", () => {
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

test("[14] Should duplicate items in a list", () => {
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

test("[15] Should duplicate items in a list", () => {
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

test("[16] Should drop every nth item from a list", () => {
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

test("[17] Should split a given list into 2 parts", () => {
  expect(split(3)(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"])).toStrictEqual({
    left: ["a", "b", "c"],
    right: ["d", "e", "f", "g", "h", "i", "j", "k"],
  });
});

test("[18] Should slice a list given a range", () => {
  expect(slice(3, 7)(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"])).toStrictEqual([
    "c",
    "d",
    "e",
    "f",
    "g",
  ]);
  expect(slice(3, 5)([1, 2, 3, 4, 5])).toStrictEqual([3, 4, 5]);
});

test("[19] Should rotate a list", () => {
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

test("[20] Should remove nth element", () => {
  expect(remove_at(1)(["a", "b", "c", "d"])).toStrictEqual(["a", "c", "d"]);
  expect(remove_at(3)(["a", "b", "c", "d"])).toStrictEqual(["a", "b", "c"]);
});

test("[21] Should insert at nth position", () => {
  expect(insert_at("alfa")(1)(["a", "b", "c", "d"])).toStrictEqual(["a", "alfa", "b", "c", "d"]);
  expect(insert_at("alfa")(5)(["a", "b", "c", "d"])).toStrictEqual(["a", "b", "c", "d", "alfa"]);
});

test("[22] Should create an array with sequential elements given range", () => {
  expect(range(4, 9)).toStrictEqual([4, 5, 6, 7, 8, 9]);
});

test("[23] Should get random selection", () => {
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 8 }), (num) => {
      const randoms = rnd_select(num)(["a", "b", "c", "d", "e", "f", "g", "h"]);

      expect(randoms.length).toEqual(num);
    }),
  );
});

test("[24] Should get random lotto selection", () => {
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

test("[25] Should generate random permutation", () => {
  const randoms = rnd_permutations(["a", "b", "c", "d", "e", "f"]);

  expect(randoms.length).toBe(6);
});

test("[26] Should generate combinations", () => {
  expect(combinations(0)(["a", "b", "c", "d"])).toStrictEqual([[]]);
  expect(combinations(1)(["a", "b", "c", "d"])).toStrictEqual([["a"], ["b"], ["c"], ["d"]]);
  expect(combinations(2)([1, 2, 3, 4])).toStrictEqual([
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
  ]);
  expect(combinations(3)(["a", "b", "c", "d", "e", "f"])).toStrictEqual([
    ["a", "b", "c"],
    ["a", "b", "d"],
    ["a", "b", "e"],
    ["a", "b", "f"],
    ["a", "c", "d"],
    ["a", "c", "e"],
    ["a", "c", "f"],
    ["a", "d", "e"],
    ["a", "d", "f"],
    ["a", "e", "f"],
    ["b", "c", "d"],
    ["b", "c", "e"],
    ["b", "c", "f"],
    ["b", "d", "e"],
    ["b", "d", "f"],
    ["b", "e", "f"],
    ["c", "d", "e"],
    ["c", "d", "f"],
    ["c", "e", "f"],
    ["d", "e", "f"],
  ]);
});

test("[27] Should return combinations of lenght 3", () => {
  expect(
    group3(["aldo", "beat", "carla", "david", "evi", "flip", "gary", "hugo", "ida"]),
  ).toHaveLength(84);
  expect(group3([1, 2, 3, 4, 5, 6])).toHaveLength(20);
  expect(group3([1, 2, 3, 4])).toStrictEqual([
    [[1, 2, 3], [4]],
    [[1, 2, 4], [3]],
    [[1, 3, 4], [2]],
    [[2, 3, 4], [1]],
  ]);
});

test("[28] Should handle a generalized `group3`", () => {
  expect(group([2, 3], ["a", "b", "c", "d", "e"])).toStrictEqual([
    [
      ["a", "b"],
      ["c", "d", "e"],
    ],
    [
      ["a", "c"],
      ["b", "d", "e"],
    ],
    [
      ["a", "d"],
      ["b", "c", "e"],
    ],
    [
      ["a", "e"],
      ["b", "c", "d"],
    ],
    [
      ["b", "c"],
      ["a", "d", "e"],
    ],
    [
      ["b", "d"],
      ["a", "c", "e"],
    ],
    [
      ["b", "e"],
      ["a", "c", "d"],
    ],
    [
      ["c", "d"],
      ["a", "b", "e"],
    ],
    [
      ["c", "e"],
      ["a", "b", "d"],
    ],
    [
      ["d", "e"],
      ["a", "b", "c"],
    ],
  ]);
  expect(
    group([2, 3, 4], ["aldo", "beat", "carla", "david", "evi", "flip", "gary", "hugo", "ida"]),
  ).toHaveLength(1260);
  expect(
    group([2, 2, 5], ["aldo", "beat", "carla", "david", "evi", "flip", "gary", "hugo", "ida"]),
  ).toHaveLength(756);
});

test("[29] Should return elements sorted by length", () => {
  expect(lsort(["abc", "de", "fgh", "de", "ijkl", "mn", "o"])).toStrictEqual([
    "o",
    "de",
    "de",
    "mn",
    "abc",
    "fgh",
    "ijkl",
  ]);
  expect(lsort(["asdf", "a", "bc", "foobar", "foo"])).toStrictEqual([
    "a",
    "bc",
    "foo",
    "asdf",
    "foobar",
  ]);
});

test("[30] Should return elements sorted by least frequency lengths first", () => {
  expect(lfsort(["abc", "de", "fgh", "de", "ijkl", "mn", "o"])).toStrictEqual([
    "ijkl",
    "o",
    "abc",
    "fgh",
    "de",
    "de",
    "mn",
  ]);
});

test("[31] Should return true if given number is prime", () => {
  expect(is_prime(4)).toBe(false);
  expect(is_prime(7)).toBe(true);
  expect(is_prime(17)).toBe(true);
  expect(is_prime(47)).toBe(true);
});

test("[32] Should calculate the prime factors", () => {
  expect(prime_factors(315)).toStrictEqual([3, 3, 5, 7]);
  expect(prime_factors(35)).toStrictEqual([5, 7]);
  expect(prime_factors(820)).toStrictEqual([2, 2, 5, 41]);
});

test("[33] Should calculate the prime factors and multiplicities", () => {
  expect(prime_factors_mult(315)).toStrictEqual([
    [3, 2],
    [5, 1],
    [7, 1],
  ]);
  expect(prime_factors_mult(820)).toStrictEqual([
    [2, 2],
    [5, 1],
    [41, 1],
  ]);
});

test("[34] Should return a list of primes within a range", () => {
  expect(primes_from(10, 20)).toStrictEqual([11, 13, 17, 19]);
  expect(primes_from(50, 100)).toStrictEqual([53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
  expect(primes_from(2, 7920)).toHaveLength(1000);
});

test("[35] Should return two primes that sum to the given even number", () => {
  expect(goldbach(2)).toBe(null);
  expect(goldbach(28)).toStrictEqual([5, 23]);
});

test("[36] Should return a list of all even numbers and their Goldbach composition", () => {
  expect(goldbach_list(9, 20)).toStrictEqual([
    [10, [3, 7]],
    [12, [5, 7]],
    [14, [3, 11]],
    [16, [3, 13]],
    [18, [5, 13]],
    [20, [3, 17]],
  ]);
  // expect(goldbach_list(3, 3000)).toStrictEqual([]);
  // ^ causes `RangeError: Maximum call stack size exceeded`
});

test("[37] Should return the gcd of two numbers", () => {
  expect(gcd(36, 63)).toBe(9);
  expect(gcd(-3, -6)).toBe(3);
  expect(gcd(-3, 6)).toBe(3);
  expect(gcd(234, 42)).toBe(6);
});

test("[38] Should return true if two numbers are coprime", () => {
  expect(coprime(35, 64)).toBe(true);
  expect(coprime(15, 8)).toBe(true);
  expect(coprime(3, 20)).toBe(true);
  expect(coprime(5, 12)).toBe(true);
});

test("[39] Should return the totient", () => {
  expect(totient_phi(10)).toBe(4);
  expect(totient_phi(9)).toBe(6);
  expect(totient_phi(20)).toBe(8);
});

test("[40] Should return the totient using improved method", () => {
  expect(phi(10)).toBe(4);
  expect(phi(13)).toBe(12);
  expect(phi(9)).toBe(6);
  expect(phi(20)).toBe(8);
});

test("[41] Should time both phi functions", () => {
  // useless test but I still want to have a sanity check
  expect(timeit(totient_phi)(10090)).toBeGreaterThan(timeit(phi)(10090));
});

test("[42] Should return a boolean table", () => {
  // a ∧ (a ∨ b)
  expect(table((a, b) => Bool.and(a, Bool.or(a, b)))).toStrictEqual([
    [true, true, true],
    [true, false, true],
    [false, true, false],
    [false, false, false],
  ]);
  // (a ∨ b) ∧ (a ∧ b)
  expect(table((a, b) => Bool.and(Bool.or(a, b), Bool.and(a, b)))).toStrictEqual([
    [true, true, true],
    [true, false, false],
    [false, true, false],
    [false, false, false],
  ]);
});

test.skip("[43]", () => {});

test.skip("[44]", () => {});

test("[45] Should return gray codes", () => {
  expect(gray(1)).toStrictEqual(["0", "1"]);
  expect(gray(2)).toStrictEqual(["00", "01", "11", "10"]);
  expect(gray(3)).toStrictEqual(["000", "001", "011", "010", "110", "111", "101", "100"]);
});

test.skip("[46] Should return huffman code table", () => {
  const frequencies: ReadonlyArray<[string, number]> = [
    ["a", 45],
    ["b", 13],
    ["c", 12],
    ["d", 16],
    ["e", 9],
    ["f", 5],
  ];
  expect(huffman(frequencies)).toStrictEqual([
    ["a", "0"],
    ["c", "100"],
    ["b", "101"],
    ["f", "1100"],
    ["e", "1101"],
    ["d", "111"],
  ]);
});

test("[47] Should return true if given a valid binary tree", () => {
  expect(is_tree({ _kind: "empty", data: 1 })).toBe(true);
  expect(
    is_tree({
      _kind: "node",
      left: { _kind: "empty", data: 1 },
      right: { _kind: "empty", data: 2 },
    }),
  ).toBe(true);
  expect(
    is_tree({
      _kind: "node",
      left: null, // invalid
      right: { _kind: "empty", data: 42 },
    }),
  ).toBe(false);
  expect(
    is_tree({
      _kind: "node",
      left: {
        _kind: "node",
        left: { _kind: "empty", data: 2 },
        right: { _kind: "empty", data: 3 },
        data: 0,
      },
      right: { _kind: "empty", data: undefined }, // invalid
      data: 1,
    }),
  ).toBe(false);
});

test.skip("[48] Should return true if given a valid binary tree", () => {
  // print_tree(
  //   mkNode(4, mkNode(2, mkEmptyNode(1), mkEmptyNode(3)), mkNode(6, mkEmptyNode(5), mkEmptyNode(7))),
  // );
  // expect(complete_binary_tree(2)).toStrictEqual({ _kind: "empty", data: "x" });
});

test.skip("[49] Should return a symmetric binary tree", () => {});

test.skip("[50] Should return true if given is valid symmetic binary tree", () => {});

test.skip("[51]", () => {});
