import { performance } from "perf_hooks"; // nodejs package

import { List, Nullable } from "./types";
import * as utils from "./utils";

// ===================
//      Problems
// ===================

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
  if (as.length === 0 || as.length === 1) {
    return null;
  }

  if (as.length === 2) {
    return as;
  }

  return last_two(utils.tail(as));
};

/*
 * Problem 3
 *
 * Find the nth element of a list. The first element in the list is number 1.
 */
export const element_at = <A>(n: number) => {
  return (as: List<A>): Nullable<A> => {
    if (n < 0 || n > as.length) {
      return null;
    }

    return as[n - 1];
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

  const last = as[as.length - 1];

  return [last, ...reverse(as.slice(0, -1))];
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

  const slice = utils.drop_right(1)(utils.drop_left(1)(as));

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

    return [...flatten(head), ...flatten(tail)];
  } else {
    return [possiblyNested];
  }
};

/*
 * Problem 8
 *
 * Eliminate consecutive duplicates of list elements.
 */
export const compress = <A>(as: List<A>): List<A> => {
  return as.reduce((acc, _val, idx) => {
    const a = as[idx];
    const b = as[idx + 1];

    if (a === b) {
      return acc;
    } else {
      return [...acc, a];
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

  return [...matches_joined, ...pack(chopped)];
};

/*
 * Problem 10
 *
 * Runs the "run-length" encoding data compression algorithm.
 * Consecutive duplicates of elements are encoded as lists (N E) where N is the number of duplicates of the element E..
 */
export const encode = (as: List<string>): List<[number, string]> => {
  const packed = pack(as);

  return packed.reduce(
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
  const packed = pack(as);

  return packed.reduce(
    (acc, val) => {
      const head = utils.hd(val.split(""));
      const len = val.length;

      const encoded = len === 1 ? mkSingleEncode(head) : mkMultipleEncode(head, len);

      return [...acc, encoded];
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

    return encode_direct_helper(chopped, [...es, encoded]);
  };

  return encode_direct_helper(as, []);
};

/*
 * Problem 14
 *
 * Duplicate each item in a given list.
 */
export const duplicate = <A>(as: List<A>): List<A> => {
  return as.reduce((acc, val) => {
    return [...acc, val, val];
  }, [] as List<A>);
};

/*
 * Problem 15
 *
 * Replicate each item in a given list n number of times.
 */
export const replicate = (n: number) => {
  return <A>(as: List<A>): List<A> => {
    return as.reduce((acc, val) => {
      let repeated = [] as Array<A>;
      for (let i = 0; i < n; i++) {
        repeated.push(val);
      }

      return [...acc, ...(repeated as List<A>)];
    }, [] as List<A>);
  };
};

/*
 * Problem 16
 *
 * Drop every nth item in a given list.
 * Note: `n` is normalized to 0 if negative.
 */
export const drop_every = (n: number) => {
  if (n < 0) {
    n = 0;
  }

  return <A>(as: List<A>): List<A> => {
    return as.reduce((acc, val, idx) => {
      if ((idx + 1) % n === 0) {
        return acc;
      } else {
        return [...acc, val];
      }
    }, [] as List<A>);
  };
};

/*
 * Problem 17
 *
 * Splits a list into two parts; the length of the first part is given.
 * Note: `n` is normalized to 0 if negative.
 */
export const split = (n: number) => {
  if (n < 0) {
    n = 0;
  }

  return <A>(as: List<A>): { left: List<A>; right: List<A> } => {
    return { left: utils.take_left(n)(as), right: utils.drop_left(n)(as) };
  };
};

/*
 * Problem 18
 *
 * Given two indices, i and k, the slice is the list containing the elements between the i'th and k'th element of the original list (both limits included). Start counting the elements with 1.
 * Note: both `start` & `end` are normalized to 0 if negative.
 */
export const slice = (start: number, end: number) => {
  if (start < 0) {
    start = 0;
  }

  if (end < 0) {
    end = 0;
  }

  return <A>(as: List<A>): List<A> => {
    return as.reduce((acc, a, idx) => {
      if (idx + 1 >= start && idx + 1 <= end) {
        return [...acc, a];
      } else {
        return acc;
      }
    }, [] as List<A>);
  };
};

/*
 * Problem 19
 *
 * Rotate a list n places to the left.
 */
export const rotate = (n: number) => {
  return <A>(as: List<A>): List<A> => {
    const length = as.length;

    return as.reduce(
      (acc, a, idx) => {
        acc[(length + idx - n) % 8] = a;

        return acc;
      },
      Array.from({ length }) as Array<A>,
    );
  };
};

/*
 * Problem 20
 *
 * Removes the nth element from a list.
 */
export const remove_at = (n: number) => {
  if (n < 0) {
    n = 0;
  }

  return <A>(as: List<A>): List<A> => {
    return as.filter((_, idx) => idx !== n);
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
      const { left, right } = split(position)(as);

      return [...left, val, ...right];
    };
  };
};

/*
 * Problem 22
 *
 * Create a list containing all integers within a given range.
 */
export const range = (start: number, end: number): List<number> => {
  let acc: Array<number> = [];

  for (let i = 0; i <= end - start; i++) {
    acc[i] = i + start;
  }

  return acc;
};

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

      randoms = [...randoms, as[random]];
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

    randoms = [...randoms, sequential_nums[random_idx]];
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
  return <A>(as: List<A>) => {
    if (n <= 0) {
      return [];
    }

    let xs = [];
    for (let i = 0; i < as.length; i++) {
      for (let j = i + 1; j < as.length; j++) {
        xs.push([as[i], as[j]]);
      }
    }

    return xs;
  };
};

/*
 * Problem 27
 *
 * Group the elements of a set into 3 disjoint subsets.
 */
export const group3 = () => {};

/*
 * Problem 28
 *
 * Generalized `group3` specifying a list of group sizes and the predicate will return a list of groups.
 */
export const group = () => {};

/*
 * Problem 29
 *
 * Sort the elements of a list according to their length.
 * e.g. short lists first, longer lists later.
 */
export const lsort = (as: List<string>): List<string> => {
  const lengths_ = as.reduce((acc, a) => [...acc, a.length], [] as Array<number>).sort();
  const lengths = utils.uniques(lengths_);

  let sorted: List<string> = [];
  for (let i = 0; i < as.length; i++) {
    sorted = [...sorted, ...as.filter((a) => a.length === lengths[i])];
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
  const lengths_ = as.reduce((acc, a) => [...acc, a.length], [] as Array<number>).sort();
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

    sorted = [...sorted, ...as.filter((a) => a.length === len)];
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
  const is_prime_helper = (n: number) => {
    return (as: List<number>): boolean => {
      const head = utils.hd(as);
      const tail = utils.tail(as);

      if (tail.length === 0) {
        return n % head !== 0;
      } else {
        return n % head !== 0 && is_prime_helper(n)(tail);
      }
    };
  };

  const possible_primes = range(2, Math.sqrt(n));

  return is_prime_helper(n)(possible_primes);
};

/*
 * Problem 32
 *
 * Determine the prime factors of a given positive integer.
 * Returns a flat list containing the prime factors in ascending order.
 */
export const prime_factors = (n: number): List<number> => {
  let factors: List<number> = [];
  let divisor = 2;

  while (n !== 1) {
    if (n % divisor === 0) {
      factors = [...factors, divisor];
      n = n / divisor;
    } else {
      divisor = divisor + 1;
    }
  }

  return factors;
};

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
  const possible_primes = range(lower, upper);

  return possible_primes.filter(is_prime);
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

    const summation_match = primes.filter((p) => p + head === n)[0];

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
  return range(1, n).reduce((acc, a) => {
    if (coprime(n, a)) {
      return 1 + acc;
    } else {
      return acc;
    }
  }, 0);
};

/*
 * Problem 40
 *
 * Calculate Euler's totient function phi(m) - improved.
 */
export const phi = (n: number): number => {
  const primes_with_multiplicities = prime_factors_mult(n);

  const helper = (ps: List<[number, number]>): number => {
    if (ps.length === 0) {
      return 1;
    } else {
      const [prime, multiplicity] = utils.hd(ps);
      const rest = utils.tail(ps);

      return (prime - 1) * Math.pow(prime, multiplicity - 1) * helper(rest);
    }
  };

  return helper(primes_with_multiplicities);
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

    return [...bits.map((b) => "0" + b), ...reverse(bits).map((b) => "1" + b)];
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

interface Node<A> {
  _kind: "node";
  data: A;
  left: Node<A>;
  right: Node<A>;
}

interface Empty<A> {
  _kind: "empty";
  data: A;
}

// eslint-disable-next-line no-unused-vars
type Tree<A> = Empty<A> | Node<A>;

const eq_empty_node = (a: unknown): boolean => {
  if (typeof a === "object") {
    if (a !== null) {
      if ("_kind" in a) {
        if (a._kind === "empty") {
          if ("data" in a) {
            return a.data !== undefined;
          }
        }
      }
    }
  }

  return false;
};

const eq_node = (a: unknown): boolean => {
  if (typeof a === "object") {
    if (a !== null) {
      if ("_kind" in a) {
        if (a._kind === "node") {
          if ("left" in a && "right" in a) {
            if (eq_empty_node(a.left) && eq_empty_node(a.right)) {
              return true;
            } else if (eq_empty_node(a.left) && !eq_empty_node(a.right)) {
              if ("data" in a) {
                return a.data !== undefined;
              }
            } else if (eq_empty_node(a.right) && !eq_empty_node(a.left)) {
              if ("data" in a) {
                return a.data !== undefined;
              }
            }
          }
        }
      }
    }
  }

  return false;
};

/*
 * Problem 47
 *
 * Check whether a given term represents a binary tree.
 */
export const is_tree = (t: unknown): boolean => {
  if (eq_empty_node(t)) {
    return true;
  }

  if (eq_node(t)) {
    return true;
  }

  return false;
};
