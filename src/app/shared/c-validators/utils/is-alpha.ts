export const isAlphaRegex = /^[A-Za-z]$/i;
export const isAlphaWithCrlRegex = /^[A-Za-zа-яА-Я]$/i;

export function isAlpha(str: string, allowCrl = true) {
  for (let char of str)
    if((allowCrl && !isAlphaWithCrlRegex.test(char)) || (!allowCrl && !isAlphaRegex.test(char)))
      return false;

  return true;
}
