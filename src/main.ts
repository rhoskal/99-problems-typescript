import * as utils from "./utils";

// ===================
//       Types
// ===================

type Nullable<A> = A | null;

// ===================
//      Problems
// ===================

/*
 * Problem 1
 *
 * Write a function `last(xs: [A]) => A` that returns the last element of a list
 */
export const last = <A>(as: ReadonlyArray<A>): Nullable<A> => {
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
export const last_two = <A>(as: ReadonlyArray<A>): Nullable<ReadonlyArray<A>> => {
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
 * Find the N'th element of a list.
 */
export const nth = <A>(n: number) => {
  return (as: ReadonlyArray<A>): Nullable<A> => {
    if (n < 0) {
      return null;
    }

    if (n > as.length) {
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
export const length = <A>(as: ReadonlyArray<A>): number => {
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
export const reverse = <A>(as: ReadonlyArray<A>): ReadonlyArray<A> => {
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
export const is_palindrome = <A>(as: ReadonlyArray<A>): boolean => {
  if (as.length < 2) {
    return true;
  }

  const first_el = utils.hd(as);
  const last_el = utils.last(as);

  const slice = utils.drop_right(1)(utils.drop_left(1)(as));

  return (first_el === last_el) === is_palindrome(slice);
};

/*
 * Problem 7
 *
 * Flatten a nested list structure.
 */
export const flatten = (possiblyNested: ReadonlyArray<unknown>): ReadonlyArray<unknown> => {
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
export const compress = <A>(as: ReadonlyArray<A>): ReadonlyArray<A> => {
  return as.reduce((acc, _val, idx) => {
    const a = as[idx];
    const b = as[idx + 1];

    if (a === b) {
      return acc;
    } else {
      return [...acc, a];
    }
  }, [] as ReadonlyArray<A>);
};

/*
 * Problem 9
 *
 * Pack consecutive duplicates of list elements into sublists.
 */
export const pack = (as: ReadonlyArray<string>): ReadonlyArray<string> => {
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
export const encode = (as: ReadonlyArray<string>): ReadonlyArray<[number, string]> => {
  const packed = pack(as);

  return packed.reduce(
    (acc, val) => {
      const head = utils.hd(val.split(""));

      return [...acc, [val.length, head]];
    },
    [] as ReadonlyArray<[number, string]>,
  );
};

/*
 * Problem 11
 *
 * Runs the "run-length" encoding data compression algorithm.
 * Consecutive duplicates of elements are encoded as lists (N E) where N is the number of duplicates of the element E..
 */
export const encode_modified = (as: ReadonlyArray<string>): ReadonlyArray<Encoded<string>> => {
  const packed = pack(as);

  return packed.reduce(
    (acc, val) => {
      const head = utils.hd(val.split(""));
      const len = val.length;

      const encoded = len === 1 ? mkSingleEncode(head) : mkMultipleEncode(head, len);

      return [...acc, encoded];
    },
    [] as ReadonlyArray<Encoded<string>>,
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
export const decode_modified = (as: ReadonlyArray<Encoded<string>>): string => {
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
export const encode_direct = (as: ReadonlyArray<string>): ReadonlyArray<Encoded<string>> => {
  return encode_direct_helper(as, []);
};

export const encode_direct_helper = (
  as: ReadonlyArray<string>,
  es: ReadonlyArray<Encoded<string>>,
): ReadonlyArray<Encoded<string>> => {
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
