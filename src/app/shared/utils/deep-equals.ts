export function deepEquals(a, b) {
  if (a === b) {
    return true;
  }

  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const key of keysA) {
      if (!deepEquals(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}
