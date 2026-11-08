import { Navigate, useLocation, useParams } from 'react-router';
import AdminResourceRoute from '../../shared/components/AdminResourceRoute';

export default function AdminLegacyResourceRedirect({
  resourceKey,
  create = false,
}: {
  resourceKey?: string;
  create?: boolean;
}) {
  const { id } = useParams();
  const { search, hash } = useLocation();
  return (
    <AdminResourceRoute resourceKey={resourceKey}>
      {(resource) => (
        <Navigate
          replace
          to={
            resource.path +
            (create ? '/new' : id ? '/' + encodeURIComponent(id) : '') +
            search +
            hash
          }
        />
      )}
    </AdminResourceRoute>
  );
}
