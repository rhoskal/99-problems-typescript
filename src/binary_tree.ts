export interface Empty {
  _kind: "empty";
}

export interface Branch<A> {
  _kind: "branch";
  data: A;
  left: BinaryTree<A>;
  right: BinaryTree<A>;
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

export const eq_empty = (x: unknown): x is Empty => {
  if (typeof x === "object") {
    if (x !== null) {
      if ("_kind" in x) {
        return x._kind === "empty";
      }
    }
  }

  return false;
};

export const eq_branch = <A>(x: unknown): x is Branch<A> => {
  if (typeof x === "object") {
    if (x !== null) {
      if ("_kind" in x) {
        if (x._kind === "branch") {
          if ("data" in x) {
            if (x.data === undefined) {
              return false;
            }

            if ("left" in x && "right" in x) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
};
