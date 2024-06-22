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
 * Drop n elements from the start of the list.
 */
export const drop_left = (n: number) => {
  return <A>(as: ReadonlyArray<A>) => {
    return as.slice(n);
  };
};
