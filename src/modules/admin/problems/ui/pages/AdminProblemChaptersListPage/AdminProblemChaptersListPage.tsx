import { AdminSimpleResourceListPage } from 'modules/admin/shared/ui/AdminSimpleResourcePages';
import { adminProblemChaptersConfig } from 'modules/admin/shared/ui/adminSimpleResourceConfigs';

const AdminProblemChaptersListPage = () => (
  <AdminSimpleResourceListPage config={adminProblemChaptersConfig} />
);

export default AdminProblemChaptersListPage;
