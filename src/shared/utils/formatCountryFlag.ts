const formatCountryFlag = (code?: string) => {
  if (!code) return '';
  const upperCased = code.toUpperCase();

  if (upperCased.length !== 2) return upperCased;

  return String.fromCodePoint(
    ...upperCased.split('').map((char) => 127397 + char.charCodeAt(0)),
  );
};

export default formatCountryFlag;
