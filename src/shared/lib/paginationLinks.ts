export const getPageHref = (pathname: string, search: string, page: number) => {
  const params = new URLSearchParams(search);
  if (page <= 1) params.delete('page');
  else params.set('page', String(page));
  const query = params.toString();
  return pathname + (query ? `?${query}` : '');
};
