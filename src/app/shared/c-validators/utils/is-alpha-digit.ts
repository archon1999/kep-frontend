export const isAlphaDigitRegex = /^[A-Za-z0-9]$/i;
export const isAlphaDigitWithCrlRegex = /^[A-Za-zа-яА-Я0-9]$/i;

export function isAlphaDigit(str: string, allowCrl = true) {
  for (let char of str)
    if ((allowCrl && !isAlphaDigitWithCrlRegex.test(char)) || (!allowCrl && !isAlphaDigitRegex.test(char)))
      return false;

  return true;
}
