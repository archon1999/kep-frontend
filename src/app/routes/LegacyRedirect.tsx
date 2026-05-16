import { Navigate, Params, generatePath, useLocation, useParams } from 'react-router';

type LegacyRedirectProps = {
  to: string;
  mapParams?: (params: Readonly<Params<string>>) => Record<string, string | number | undefined>;
};

const LegacyRedirect = ({ to, mapParams }: LegacyRedirectProps) => {
  const params = useParams();
  const location = useLocation();

  const mappedParams = mapParams ? mapParams(params) : params;
  const normalizedParams = Object.fromEntries(
    Object.entries(mappedParams).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number>;

  const targetPath = Object.entries(normalizedParams).reduce(
    (result, [key, value]) => result.replaceAll(`:${key}`, encodeURIComponent(value.toString())),
    generatePath(to, normalizedParams),
  );
  const [pathnameWithSearch, targetHash] = targetPath.split('#');
  const [pathname, targetSearch] = pathnameWithSearch.split('?');

  return (
    <Navigate
      replace
      to={{
        pathname,
        search: targetSearch ? `?${targetSearch}` : location.search,
        hash: targetHash ? `#${targetHash}` : location.hash,
      }}
    />
  );
};

export default LegacyRedirect;
