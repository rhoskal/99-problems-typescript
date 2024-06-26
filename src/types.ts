export type Nullable<A> = A | null;

export interface Predicate<A> {
  // eslint-disable-next-line no-unused-vars
  (a: A): boolean;
}

// because it gets old typing this over, and over, over...
export type List<A> = ReadonlyArray<A>;
export type LoL<A> = ReadonlyArray<ReadonlyArray<A>>;
