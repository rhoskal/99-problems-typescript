export interface Empty {
  readonly _kind: "empty";
}

export interface Branch<A> {
  readonly _kind: "branch";
  readonly data: A;
  readonly left: BinaryTree<A>;
  readonly right: BinaryTree<A>;
}

export type BinaryTree<A> = Empty | Branch<A>;

export const mkEmpty = (): Empty => {
  return {
    _kind: "empty",
  };
};

export const mkLeaf = <A>(a: A): BinaryTree<A> => {
  return {
    _kind: "branch",
    data: a,
    left: mkEmpty(),
    right: mkEmpty(),
  };
};

export const mkBranch = <A>(a: A, left: BinaryTree<A>, right: BinaryTree<A>): Branch<A> => {
  return {
    _kind: "branch",
    data: a,
    left,
    right,
  };
};

/*
 * For some reason, TypeScript doesn't narrow type when using `hasOwnProperty("key")`
 * but does when using the `in` operator.
 * https://github.com/microsoft/TypeScript/issues/10485
 */

export const eq_empty = (x: unknown): x is Empty => {
  if (typeof x === "object") {
    if (x !== null) {
      if ("_kind" in x) {
        return x._kind === "empty";
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const eq_branch = <A>(x: unknown): x is Branch<A> => {
  if (typeof x === "object") {
    if (x !== null) {
      if ("_kind" in x) {
        if (x._kind === "branch") {
          if ("data" in x) {
            if (x.data === undefined || x.data === null) {
              return false;
            }

            if ("left" in x && "right" in x) {
              return (
                x.left !== undefined && x.left !== null && x.right !== undefined && x.right !== null
              );
              // return true;
            }
          }
        }
      }
    }
  }

  return false;
};
