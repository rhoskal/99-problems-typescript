export const and = (a: boolean, b: boolean): boolean => {
  return a && b;
};

export const not = (a: boolean): boolean => {
  return !a;
};

export const or = (a: boolean, b: boolean): boolean => {
  return a || b;
};

export const nand = (a: boolean, b: boolean): boolean => {
  return not(a && b);
};

export const nor = (a: boolean, b: boolean): boolean => {
  return not(a || b);
};

export const xor = (a: boolean, b: boolean): boolean => {
  if (a === true && b === false) {
    return true;
  } else if (a === false && b === true) {
    return true;
  } else {
    return false;
  }
};
