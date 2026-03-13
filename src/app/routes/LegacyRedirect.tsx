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

  const targetPath = generatePath(to, normalizedParams);

  return (
    <Navigate
      replace
      to={{
        pathname: targetPath,
        search: location.search,
        hash: location.hash,
      }}
    />
  );
};

export default LegacyRedirect;
