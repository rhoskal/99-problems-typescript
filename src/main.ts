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
export const last = <A>(xs: ReadonlyArray<A>): Nullable<A> => {
  if (xs.length === 0) {
    return null;
  }

  if (xs.length === 1) {
    return utils.hd(xs);
  } else {
    return last(utils.tail(xs));
  }
};

/*
 * Problem 2
 *
 * Find the last two (last and penultimate) elements of a list.
 */
export const last_two = <A>(xs: ReadonlyArray<A>): Nullable<ReadonlyArray<A>> => {
  if (xs.length === 0 || xs.length === 1) {
    return null;
  }

  if (xs.length === 2) {
    return xs;
  }

  return last_two(utils.tail(xs));
};

/*
 * Problem 3
 *
 * Find the N'th element of a list.
 */
export const nth = <A>(n: number) => {
  return (xs: ReadonlyArray<A>): Nullable<A> => {
    if (n < 0) {
      return null;
    }

    if (n > xs.length) {
      return null;
    }

    return xs[n - 1];
  };
};

/*
 * Problem 4
 *
 * Find the number of elements of a list.
 */
export const length = <A>(xs: ReadonlyArray<A>): number => {
  if (xs.length === 0) {
    return 0;
  }

  return 1 + length(utils.tail(xs));
};

/*
 * Problem 5
 *
 * Reverse the elements of a list.
 */
export const reverse = <A>(xs: ReadonlyArray<A>): ReadonlyArray<A> => {
  if (xs.length < 2) {
    return xs;
  }

  const last = xs[xs.length - 1];

  return [last, ...reverse(xs.slice(0, -1))];
};
