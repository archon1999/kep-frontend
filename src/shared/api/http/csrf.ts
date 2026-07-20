const decodeCookieValue = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const getCookieValue = (cookieHeader: string, name: string) => {
  const encodedName = `${encodeURIComponent(name)}=`;
  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(encodedName));

  return cookie ? decodeCookieValue(cookie.slice(encodedName.length)) : null;
};

export const getCsrfToken = () => {
  if (typeof document === 'undefined') return null;

  return getCookieValue(document.cookie, 'csrftoken');
};
