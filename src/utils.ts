/**
 * Get the first element of a list.
 */
export const hd = <A>(as: ReadonlyArray<A>): A => {
  return as[0];
};

/**
 * Removes the first element of a list.
 */
export const tail = <A>(as: ReadonlyArray<A>): ReadonlyArray<A> => {
  return as.slice(1);
};

/**
 * Return last element of a list.
 */
export const last = <A>(as: ReadonlyArray<A>): A => {
  return as[as.length - 1];
};

/**
 * Drop n elements from the start of a list.
 */
export const drop_left = (n: number) => {
  return <A>(as: ReadonlyArray<A>) => {
    return as.slice(n);
  };
};

/**
 * Drop n elements from the end of a list.
 */
export const drop_right = (n: number) => {
  return <A>(as: ReadonlyArray<A>) => {
    return as.slice(0, n * -1);
  };
};

interface Predicate<A> {
  // eslint-disable-next-line no-unused-vars
  (a: A): boolean;
}

const span_left_index = <A>(predicate: Predicate<A>) => {
  return (as: ReadonlyArray<A>): number => {
    let i = 0;

    for (; i < as.length; i++) {
      if (!predicate(as[i])) {
        break;
      }
    }

    return i;
  };
};

/**
 * Applies a predicate to the original list resulting in a new list containing elements that did not satisfy the predicate.
 * Similar to `drop_left` but uses a predicate rather than a specified length.
 */
export const drop_while = <A>(predicate: Predicate<A>) => {
  return (as: ReadonlyArray<A>): ReadonlyArray<A> => {
    return as.slice(span_left_index(predicate)(as));
  };
};

/**
 * Applies a predicate to the original list resulting in a new list containing elements that matched until the condition is false.
 */
export const take_while = <A>(predicate: Predicate<A>) => {
  return (as: ReadonlyArray<A>): ReadonlyArray<A> => {
    const matched: Array<A> = [];

    for (const a of as) {
      if (!predicate(a)) {
        break;
      }

      matched.push(a);
    }

    return matched;
  };
};
