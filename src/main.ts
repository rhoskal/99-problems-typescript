type Nullable<T> = T | null;

/*
 * Problem 1
 *
 * Write a function `last(xs: [T]) => T` that returns the last element of a list
 */
export const last = <T>(xs: ReadonlyArray<T>): Nullable<T> => {
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
export const last_two = <T>(xs: ReadonlyArray<T>): Nullable<ReadonlyArray<T>> => {
  if (xs.length === 0 || xs.length === 1) {
    return null;
  }

  if (xs.length === 2) {
    return xs;
  }

  return last_two(xs.slice(1));
};

/*
 * Problem 3
 *
 * Find the N'th element of a list.
 */
export const nth = <T>(n: number) => {
  return (xs: ReadonlyArray<T>): Nullable<T> => {
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
export const length = <T>(xs: ReadonlyArray<T>): number => {
  if (xs.length === 0) {
    return 0;
  }

  return 1 + length(xs.slice(1));
};
