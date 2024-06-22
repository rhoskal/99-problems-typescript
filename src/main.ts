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
