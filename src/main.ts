import { performance } from "perf_hooks"; // nodejs package

import { BinaryTree } from "./binary_tree";
import * as BT from "./binary_tree";
import { List, LoL, Nullable } from "./types";
import * as utils from "./utils";

/*
 * Problem 1
 *
 * Return the last element of a list.
 */
export const last = <A>(as: List<A>): Nullable<A> => {
  if (as.length === 0) {
    return null;
  }

  if (as.length === 1) {
    return utils.hd(as);
  } else {
    return last(utils.tail(as));
  }
};

/*
 * Problem 2
 *
 * Find the last two (last and penultimate) elements of a list.
 */
export const last_two = <A>(as: List<A>): Nullable<List<A>> => {
  if (as.length < 2) {
    return null;
  } else if (as.length === 2) {
    return as;
  } else {
    return last_two(utils.tail(as));
  }
};

/*
 * Problem 3
 *
 * Find the nth element of a list. The first element in the list is number 1.
 */
export const element_at = <A>(n: number) => {
  return (as: List<A>): Nullable<A> => {
    if (n <= 0) {
      return null;
    } else if (n > as.length) {
      return null;
    } else {
      return as[n - 1];
    }
  };
};

/*
 * Problem 4
 *
 * Find the number of elements of a list.
 */
export const length = <A>(as: List<A>): number => {
  if (as.length === 0) {
    return 0;
  }

  return 1 + length(utils.tail(as));
};

/*
 * Problem 5
 *
 * Reverse the elements of a list.
 */
export const reverse = <A>(as: List<A>): List<A> => {
  if (as.length < 2) {
    return as;
  }

  const last = utils.last(as);

  return [last].concat(...reverse(as.slice(0, -1)));
};

/*
 * Problem 6
 *
 * Determine if a list is a palindrome.
 */
export const is_palindrome = <A>(as: List<A>): boolean => {
  if (as.length < 2) {
    return true;
  }

  const slice = utils.drop_right(1)(utils.tail(as));

  return (utils.hd(as) === utils.last(as)) === is_palindrome(slice);
};

/*
 * Problem 7
 *
 * Flatten a nested list structure.
 */
export const flatten = (possiblyNested: List<unknown>): List<unknown> => {
  if (Array.isArray(possiblyNested)) {
    if (possiblyNested.length === 0) {
      return possiblyNested;
    }

    const head = utils.hd(possiblyNested);
    const tail = utils.tail(possiblyNested);

    return ([] as List<unknown>).concat(...flatten(head), ...flatten(tail));
  } else {
    return ([] as List<unknown>).concat(possiblyNested);
  }
};

/*
 * Problem 8
 *
 * Eliminate consecutive duplicates of list elements.
 */
export const compress = <A>(as: List<A>): List<A> => {
  return as.reduce((acc, a, idx) => {
    const b = as[idx + 1];

    if (a === b) {
      return acc;
    } else {
      return acc.concat(a);
    }
  }, [] as List<A>);
};

/*
 * Problem 9
 *
 * Pack consecutive duplicates of list elements into sublists.
 */
export const pack = (as: List<string>): List<string> => {
  if (as.length === 0) {
    return [];
  }

  const head = utils.hd(as);

  const matches = utils.take_while((x: string) => x === head)(as);
  const matches_joined = Array.of(matches.join(""));

  const chopped = utils.drop_while((x: string) => x === head)(utils.tail(as));

  return matches_joined.concat(pack(chopped));
};

/*
 * Problem 10
 *
 * Runs the "run-length" encoding data compression algorithm.
 * Consecutive duplicates of elements are encoded as lists (N E) where N is the number of duplicates of the element E..
 */
export const encode = (as: List<string>): List<[number, string]> => {
  return pack(as).reduce(
    (acc, val) => {
      const head = utils.hd(val.split(""));

      return [...acc, [val.length, head]];
    },
    [] as List<[number, string]>,
  );
};

/*
 * Problem 11
 *
 * Runs the "run-length" encoding data compression algorithm.
 * Consecutive duplicates of elements are encoded as lists (N E) where N is the number of duplicates of the element E..
 */
export const encode_modified = (as: List<string>): List<Encoded<string>> => {
  return pack(as).reduce(
    (acc, val) => {
      const head = utils.hd(val.split(""));
      const len = val.length;

      const encoded = len === 1 ? mkSingleEncode(head) : mkMultipleEncode(head, len);

      return acc.concat(encoded);
    },
    [] as List<Encoded<string>>,
  );
};

interface MultipleEncode<A> {
  _kind: "multiple_encode";
  value: A;
  count: number;
}

interface SingleEncode<A> {
  _kind: "single_encode";
  value: A;
}

type Encoded<A> = MultipleEncode<A> | SingleEncode<A>;

const mkMultipleEncode = (value: string, count: number): MultipleEncode<string> => ({
  _kind: "multiple_encode",
  value,
  count,
});

const mkSingleEncode = (value: string): SingleEncode<string> => ({
  _kind: "single_encode",
  value,
});

/*
 * Problem 12
 *
 * Decodes the "run-length" encoding data compression algorithm from problem 11.
 */
export const decode_modified = (as: List<Encoded<string>>): string => {
  return as.reduce((acc, encoded) => {
    const count = encoded._kind === "multiple_encode" ? encoded.count : 1;

    return acc.concat(encoded.value.repeat(count));
  }, "");
};

/*
 * Problem 13
 *
 * Run-length encoding of a list (direct solution).
 * Implement the so-called run-length encoding data compression method directly.
 * e.g. don't explicitly create the sublists containing the duplicates, as in
 * problem 9, but only count them. As in problem P11, simplify the result list
 * by replacing the singleton lists (1 X) by X.
 */
export const encode_direct = (as: List<string>): List<Encoded<string>> => {
  const encode_direct_helper = (
    as: List<string>,
    es: List<Encoded<string>>,
  ): List<Encoded<string>> => {
    if (as.length === 0) {
      return es;
    }

    const head = utils.hd(as);

    const matches = utils.take_while((x: string) => x === head)(as);

    const encoded =
      matches.length === 1 ? mkSingleEncode(head) : mkMultipleEncode(head, matches.length);

    const chopped = utils.drop_while((x: string) => x === head)(utils.tail(as));

    return encode_direct_helper(chopped, es.concat(encoded));
  };

  return encode_direct_helper(as, []);
};

/*
 * Problem 14
 *
 * Duplicate each item in a given list.
 */
export const duplicate = <A>(as: List<A>): List<A> => {
  if (as.length === 0) {
    return [];
  } else {
    const head = utils.hd(as);
    const tail = utils.tail(as);

    return [head, head].concat(duplicate(tail));
  }
};

/*
 * Problem 15
 *
 * Replicate each item in a given list n number of times.
 */
export const replicate = (n: number) => {
  return <A>(as: List<A>): List<A> => {
    return as.reduce((acc, a) => {
      const repeated = Array.from({ length: n }, () => a);

      return acc.concat(repeated);
    }, [] as List<A>);
  };
};

/*
 * Problem 16
 *
 * Drop every nth item in a given list.
 */
export const drop_every = (n: number) => {
  return <A>(as: List<A>): List<A> => {
    if (as.length === 0) {
      return [];
    } else {
      return utils
        .take_left(n - 1)(as)
        .concat(drop_every(n)(utils.drop_left(n)(as)));
    }
  };
};

/*
 * Problem 17
 *
 * Splits a list into two parts; the length of the first part is given.
 */
export const split = (n: number) => {
  return <A>(as: List<A>): { left: List<A>; right: List<A> } => {
    return {
      left: utils.take_left(n)(as),
      right: utils.drop_left(n)(as),
    };
  };
};

/*
 * Problem 18
 *
 * Given two indices, i and k, the slice is the list containing the elements between the i'th and k'th element of the original list (both limits included). Start counting the elements with 1.
 */
export const slice = (start: number, end: number) => {
  return <A>(as: List<A>): List<A> => {
    if (end < start) {
      return [];
    } else {
      return utils.take_left(end - start + 1)(utils.drop_left(start - 1)(as));
    }
  };
};

/*
 * Problem 19
 *
 * Rotate a list n places to the left.
 */
export const rotate = (n: number) => {
  return <A>(as: List<A>): List<A> => {
    if (n < 0) {
      return utils
        .drop_left(n + as.length)(as)
        .concat(utils.take_left(n + as.length)(as));
    } else {
      return utils.drop_left(n)(as).concat(utils.take_left(n)(as));
    }
  };
};

/*
 * Problem 20
 *
 * Removes the nth element from a list.
 */
export const remove_at = (n: number) => {
  return <A>(as: List<A>): List<A> => {
    if (n < 0) {
      return as;
    } else {
      return utils
        .take_left(n - 1)(as)
        .concat(utils.drop_left(n)(as));
    }
  };
};

/*
 * Problem 21
 *
 * Inserts an element at the nth position.
 * Start counting list elements with 0. If the position is larger or equal to
 * the length of the list, insert the element at the end.
 * (The behavior is unspecified if the position is negative.)
 */
export const insert_at = <A>(val: A) => {
  return (position: number) => {
    return (as: List<A>): List<A> => {
      if (position < 0) {
        return as;
      } else if (position >= as.length) {
        return as.concat(val);
      } else {
        return utils
          .take_left(position - 1)(as)
          .concat(val, utils.drop_left(position - 1)(as));
      }
    };
  };
};

// export const insert_at = <A>(val: A) => {
//   return (position: number) => {
//     return (as: List<A>): List<A> => {
//       const { left, right } = split(position)(as);

//       return ([] as List<A>).concat(...left, val, ...right);
//     };
//   };
// };

/*
 * Problem 22
 *
 * Create a list containing all integers within a given range.
 */
export const range = (start: number, end: number): List<number> => {
  if (end < start) {
    return [];
  } else {
    return [start].concat(range(start + 1, end));
  }
};

// export const range = (start: number, end: number): List<number> => {
//   let acc: Array<number> = [];

//   for (let i = 0; i <= end - start; i++) {
//     acc[i] = i + start;
//   }

//   return acc;
// };

/*
 * Problem 23
 *
 * Extract a given number of randomly selected elements from a list.
 */
export const rnd_select = (n: number) => {
  return <A>(as: List<A>): List<A> => {
    let randoms = [] as List<A>;

    for (let i = 0; i < n; i++) {
      const random = Math.floor(Math.random() * n);

      randoms = randoms.concat(as[random]);
    }

    return randoms;
  };
};

/*
 * Problem 24
 *
 * Extract n different random numbers from the set 1..M.
 */
export const lotto_select = (start: number, end: number): List<number> => {
  const sequential_nums = range(start, end);
  const num_of_choices = Math.floor(1 + Math.random() * (end - start));

  let randoms: List<number> = [];
  for (let i = 0; i < num_of_choices; i++) {
    const random_idx = Math.floor(Math.random() * num_of_choices);

    randoms = randoms.concat(sequential_nums[random_idx]);
  }

  return randoms;
};

/*
 * Problem 25
 *
 * Generate a random permutation of the elements of a list.
 * Note: this solution does not guarantee uniqueness (distinct elements) from `as`
 */
export const rnd_permutations = <A>(as: List<A>): List<A> => {
  return rnd_select(as.length)(as);
};

/*
 * Problem 26
 *
 * Generate combinations of k distinct objects chosen from the n elements of a list.
 */
export const combinations = (n: number) => {
  const combinations_helper = <A>(n: number, as: List<A>, acc: List<A>): LoL<A> => {
    if (n === 0) {
      return [acc];
    }

    let result: LoL<A> = [];

    // Recursive Case 1: Include current element
    if (as.length > 0) {
      const head = utils.hd(as);
      const tail = utils.tail(as);

      let included_combos = combinations_helper(n - 1, tail, acc.concat(head));
      result = result.concat(included_combos);
    }

    // Recursive Case 2: Skip current element
    if (as.length > 0) {
      const tail = utils.tail(as);

      let skipped_combos = combinations_helper(n, tail, acc);
      result = result.concat(skipped_combos);
    }

    return result;
  };

  return <A>(as: List<A>): LoL<A> => {
    return combinations_helper(n, as, []);
  };
};

/*
 * Problem 27
 *
 * Group the elements of a set into 3 disjoint subsets.
 */
export const group3 = <T>(xs: List<T>): List<Combination<T>> => {
  return group([3], xs);
};

/*
 * Problem 28
 *
 * Generalized `group3` specifying a list of group sizes and the predicate will return a list of groups.
 */
export const group = <T>(group_sizes: List<number>, xs: List<T>): List<Combination<T>> => {
  if (group_sizes.length === 0) {
    return [[]];
  }

  const n = utils.hd(group_sizes);
  const restNs = utils.tail(group_sizes);
  const combos = combinations_prime(n, xs);

  const helper = <T>(as: List<T>, bs: List<T>) => {
    return group(restNs, bs).map((g) => [as, ...g]);
  };

  return combos.flatMap(([as, bs]) => helper(as, bs));
};

type Combination<T> = List<List<T>>;

const combinations_prime = <T>(n: number, xs: List<T>): List<Combination<T>> => {
  if (n === 0) {
    return [[[], xs]];
  } else if (xs.length === 0) {
    return [];
  } else {
    const head = utils.hd(xs);
    const tail = utils.tail(xs);

    const selected: List<Combination<T>> = combinations_prime(n - 1, tail).map(([ys, zs]) => {
      return [[head, ...ys], zs];
    });
    const remaining: List<Combination<T>> = combinations_prime(n, tail).map(([ys, zs]) => {
      return [ys, [head, ...zs]];
    });

    return selected.concat(remaining);
  }
};

/*
 * Problem 29
 *
 * Sort the elements of a list according to their length.
 * e.g. short lists first, longer lists later.
 */
export const lsort = (as: List<string>): List<string> => {
  const lengths_ = as.reduce((acc, a) => acc.concat(a.length), [] as Array<number>).sort();
  const lengths = utils.uniques(lengths_);

  let sorted: List<string> = [];
  for (let i = 0; i < as.length; i++) {
    sorted = sorted.concat(...as.filter((a) => a.length === lengths[i]));
  }

  return sorted;
};

/*
 * Problem 30
 *
 * Sort the elements of a list according to their length frequency.
 * e.g. in the default, where sorting is done ascendingly, lists with rare
 * lengths are placed first, others with a more frequent length come later.
 */
export const lfsort = (as: List<string>): List<string> => {
  const lengths_ = as.reduce((acc, a) => acc.concat(acc, a.length), [] as Array<number>).sort();
  const lengths = utils.uniques(lengths_);

  let withCounts_: Array<[number, number]> = [];
  for (let i = 0; i < lengths.length; i++) {
    const counts = as.filter((a) => a.length === lengths[i]).length;

    withCounts_ = [...withCounts_, [counts, lengths[i]]];
  }

  const byLeastFrequency = (a: [number, number], b: [number, number]): -1 | 0 | 1 => {
    const [a1, b1] = a;
    const [a2, b2] = b;

    if (a1 < a2) {
      return -1;
    } else if (a2 < a1) {
      return 1;
    } else {
      if (b2 < b1) {
        return -1;
      } else if (b1 < b2) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  const withCounts = withCounts_.sort(byLeastFrequency);

  let sorted: List<string> = [];
  for (let i = 0; i < withCounts.length; i++) {
    // eslint-disable-next-line no-unused-vars
    const [_count, len] = withCounts[i];

    sorted = sorted.concat(...as.filter((a) => a.length === len));
  }

  return sorted;
};

/*
 * Problem 31
 *
 * Determine whether a given number is prime.
 * Note: uses "trivial division" which is the most basic algo.
 */
export const is_prime = (n: number): boolean => {
  if (n < 2) {
    return false;
  } else {
    const candidates = [2].concat(range(3, Math.sqrt(n)).filter((x) => x % 2 != 0));

    return utils
      .take_while((c: number) => c * c <= n)(candidates)
      .every((x) => n % x != 0);
  }
};

/*
 * Problem 32
 *
 * Determine the prime factors of a given positive integer.
 * Returns a flat list containing the prime factors in ascending order.
 */
export const prime_factors = (n: number): List<number> => {
  const prime_factors_prime = (num: number, divisor: number): List<number> => {
    if (num === 1) {
      return [];
    } else if (num % divisor == 0) {
      return [divisor].concat(prime_factors_prime(num / divisor, divisor));
    } else {
      return prime_factors_prime(num, divisor + 1);
    }
  };

  return prime_factors_prime(n, 2);
};

// export const prime_factors = (n: number): List<number> => {
//   let factors: List<number> = [];
//   let divisor: number = 2;

//   while (n !== 1) {
//     if (n % divisor === 0) {
//       factors = factors.concat(divisor);
//       n = n / divisor;
//     } else {
//       divisor = divisor + 1;
//     }
//   }

//   return factors;
// };

/*
 * Problem 33
 *
 * Determine the prime factors and their multiplicities of a given positive integer.
 */
export const prime_factors_mult = (n: number): List<[number, number]> => {
  // could have used `encode` from problem 10 but it's not parametrically polymorphic

  const helper = (primes: List<number>) => {
    return (primes_with_multiplicities: List<[number, number]>): List<[number, number]> => {
      if (primes.length === 0) {
        return primes_with_multiplicities;
      } else {
        const prime = utils.hd(primes);
        const multiplicities = utils.take_while((a) => a === prime)(primes).length;
        const chopped = utils.drop_left(multiplicities)(primes);

        return helper(chopped)([...primes_with_multiplicities, [prime, multiplicities]]);
      }
    };
  };

  const primes = prime_factors(n);

  return helper(primes)([]);
};

/*
 * Problem 34
 *
 * Given a range of integers by its lower and upper limit, construct a list of all prime numbers in that range.
 */
export const primes_from = (lower: number, upper: number): List<number> => {
  return range(lower, upper).filter(is_prime);
};

/*
 * Problem 35
 *
 * Goldbach's conjecture - finds two prime numbers that sum up to a given even integer.
 */
export const goldbach = (n: number): Nullable<GoldbachPair> => {
  if (n <= 2) {
    return null;
  }

  const helper = (ps: List<number>) => {
    const head = utils.hd(ps);
    const tail = utils.tail(ps);

    const summation_match = utils.hd(primes.filter((p) => p + head === n));

    if (summation_match === undefined) {
      return helper(tail);
    } else {
      return [head, summation_match] as GoldbachPair;
    }
  };

  const primes = primes_from(3, n);

  return helper(primes);
};

type GoldbachPair = [number, number];

/*
 * Problem 36
 *
 * Given a range of integers by its lower and upper limit, print a list of
 * all even numbers and their Goldbach composition.
 */
export const goldbach_list = (lower: number, upper: number): List<[number, GoldbachPair]> => {
  const evens = range(lower, upper).filter((p) => p % 2 === 0);

  return evens.reduce(
    (acc, even): List<[number, GoldbachPair]> => {
      const gb_pair = goldbach(even);

      if (gb_pair === null) {
        return acc;
      } else {
        return [...acc, [even, gb_pair]];
      }
    },
    [] as List<[number, GoldbachPair]>,
  );
};

/*
 * Problem 37
 *
 * Determine the greatest common divisor of two positive numbers.
 * Note: uses Euclid's algo
 */
export const gcd = (a: number, b: number): number => {
  if (a === 0) {
    return b;
  }

  return gcd(Math.abs(b) % Math.abs(a), Math.abs(a));
};

/*
 * Problem 38
 *
 * Determine whether two positive integer numbers are coprime.
 * Note: two numbers are coprime if their greatest common divisor equals 1.
 */
export const coprime = (a: number, b: number): boolean => {
  return gcd(a, b) === 1;
};

/*
 * Problem 39
 *
 * Calculate Euler's totient function phi(m).
 */
export const totient_phi = (n: number): number => {
  return range(1, n).filter((i) => coprime(n, i)).length;
};

/*
 * Problem 40
 *
 * Calculate Euler's totient function phi(m) - improved.
 */
export const phi = (n: number): number => {
  return prime_factors_mult(n).reduce((acc, [p, m]) => acc * (p - 1) * Math.pow(p, m - 1), 1);
};

/*
 * Problem 41
 *
 * Calculate Euler's totient function phi(m) - improved.
 */
export const timeit = <F extends Function>(f: F) => {
  return (a: number): number => {
    const start_time = performance.now();
    f(a);
    const stop_time = performance.now();

    return stop_time - start_time;
  };
};

/*
 * Problem 42
 *
 * Truth table for logical expressions.
 * I'd rather return a value than print table to the console.
 */
export const table = (expr: BoolExpression): BoolTable => {
  return [
    [true, true, expr(true, true)],
    [true, false, expr(true, false)],
    [false, true, expr(false, true)],
    [false, false, expr(false, false)],
  ];
};

// eslint-disable-next-line no-unused-vars
type BoolExpression = (a: boolean, b: boolean) => boolean;
type BoolTable = [Triple, Triple, Triple, Triple];
type Triple = [boolean, boolean, boolean];

/*
 * Problem 43
 *
 * Truth tables for logical expressions.
 * Same as Problem 46 but using more natural expression syntax.
 */
// export const table2 = (expr: BoolExpression): BoolTable => {};

/*
 * Problem 44
 *
 * Truth tables for logical expressions.
 * Same as Problem 46 but using more natural expression syntax.
 */
// export const table3 = (expr: BoolExpression): BoolTable => {};

/*
 *  Problem 45
 *
 * An n-bit Gray code is a sequence of n-bit strings constructed according to certain rules
 * Algo in-action:
 *   n: 2
 *   n: 1
 *   n: 0
 *   bits1: [ '' ]
 *   xs: [ '0' ]
 *   ys: [ '1' ]
 *   bits2: [ '0', '1' ]
 *   xs: [ '00', '01' ]
 *   ys: [ '11', '10' ]
 */
export const gray = (n: number): List<string> => {
  if (n === 0) {
    return [""];
  } else {
    const bits = gray(n - 1);

    return ([] as List<string>).concat(
      ...bits.map((b) => "0" + b),
      ...reverse(bits).map((b) => "1" + b),
    );
  }
};

/*
 * Problem 46
 *
 * Constructs the Huffman code table for the frequency table `fs`
 */
export const huffman = (_fs: List<[string, number]>): List<[string, string]> => {
  return [];
};

/*
 * Problem 47
 *
 * Check whether a given term represents a binary tree.
 * Note: since TypeScript doesn't have nominal types, we must validate the shape,
 * values and has no additional keys.
 */
export const is_tree = <A>(x: unknown): x is BinaryTree<A> => {
  if (BT.eq_empty(x)) {
    return true;
  } else if (BT.eq_branch(x)) {
    return is_tree(x.left) && is_tree(x.right);
  } else {
    return false;
  }
};

/*
 * Problem 48
 *
 * Construct completely balanced binary tree for a given number of nodes.
 * In a completely balanced binary tree, the following property holds for every node:
 * The number of nodes in its left subtree and the number of nodes in its right subtree
 * are almost equal, which means their difference is not greater than one.
 * Note: use "x" as the data & generate all solutions via backtracking.
 */
// export const create_complete_tree = (n: number): List<Tree<"x">> => {};

// Backtracking is a problem-solving algorithmic technique that involves
// finding a solution incrementally by trying different options and undoing
// them if they lead to a dead end.
// A backtracking algorithm works by recursively exploring all possible
// solutions to a problem. It starts by choosing an initial solution, and then
// it explores all possible extensions of that solution. If an extension leads
// to a solution, the algorithm returns that solution. If an extension does not
// lead to a solution, the algorithm backtracks to the previous solution and
// tries a different extension.

// ======
// Example: Finding the shortest path through a maze
// Input: A maze represented as a 2D array, where 0 represents an open space and 1 represents a wall.

// Algorithm:
// Start at the starting point.
// For each of the four possible directions (up, down, left, right), try moving in that direction.
// If moving in that direction leads to the ending point, return the path taken.
// If moving in that direction does not lead to the ending point, backtrack to the previous position and try a different direction.
// Repeat steps 2-4 until the ending point is reached or all possible paths have been explored.

// https://en.wikipedia.org/wiki/Binary_tree
// https://www.freecodecamp.org/news/binary-tree-algorithms-for-javascript-beginners/
// https://stackoverflow.com/questions/39054253/display-binary-search-tree-traversal-on-javascript-recursive-way#39054650

/*
 * Problem 49
 *
 * Check whether a given binary tree is symmetric.
 */
export const is_symmetric_tree = <A>(x: unknown): x is BinaryTree<A> => {
  const isMirror = <A>(node1: BinaryTree<A>, node2: BinaryTree<A>): boolean => {
    if (BT.eq_empty(node1) && BT.eq_empty(node2)) {
      return true;
    } else if (BT.eq_branch(node1) && BT.eq_branch(node2)) {
      return isMirror(node1.left, node2.right) && isMirror(node1.right, node2.left);
    } else {
      return false;
    }
  };

  if (typeof x === "object") {
    if (x !== null) {
      if (BT.eq_empty(x)) {
        return true;
      } else if (BT.eq_branch(x)) {
        return isMirror(x.left, x.right);
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};
