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

/*
 * Problem 2
 *
 * Find the last two (last and penultimate) elements of a list.
 */
export const last_two = <T>(xs: ReadonlyArray<T>): ReadonlyArray<T> | null => {
  if (xs.length === 0 || xs.length === 1) {
    return null;
  }

  if (xs.length === 2) {
    return xs;
  }

  return last_two(xs.slice(1));
};
