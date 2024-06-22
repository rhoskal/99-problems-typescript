/*
 * Problem 1
 *
 * Write a function `last(xs: [T]) => T` that returns the last element of a list
 * Recursive implementation.
 */
export const last = <T>(xs: ReadonlyArray<T>): T | null => {
  if (xs.length === 0) {
    return null;
  }

  if (xs.length === 1) {
    return xs[0];
  } else {
    return last(xs.slice(1));
  }
};
