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

const keysAreValid = (obj: unknown, keys: ReadonlyArray<string>): boolean => {
  if (typeof obj === "object") {
    if (obj !== null) {
      return Object.keys(obj).every((key) => keys.includes(key));
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const allKeysArePresent = (obj: unknown, keys: ReadonlyArray<string>): boolean => {
  if (typeof obj === "object") {
    if (obj !== null) {
      const objKeys = Object.keys(obj);

      return keys.every((key) => objKeys.includes(key));
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const keysMatch = (obj: unknown, keys: ReadonlyArray<string>): boolean => {
  return keysAreValid(obj, keys) && allKeysArePresent(obj, keys);
};

export const eq_empty = (x: unknown): x is Empty => {
  const verifyShape = (x: unknown): boolean => {
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

  return verifyShape(x) && keysMatch(x, ["_kind"]);
};

export const eq_branch = <A>(x: unknown): x is Branch<A> => {
  const verifyShape = (x: unknown): boolean => {
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
                  x.left !== undefined &&
                  x.left !== null &&
                  x.right !== undefined &&
                  x.right !== null
                );
              } else {
                return false;
              }
            } else {
              return false;
            }
          } else {
            return false;
          }
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

  return verifyShape(x) && keysMatch(x, ["_kind", "data", "left", "right"]);
};

// const insert_depth_first = <A>(a: A): Tree<A> => {};

// const insert_breadth_first = <A>(a: A): Tree<A> => {};
