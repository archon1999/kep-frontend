import { AdminSimpleResourceListPage } from 'modules/admin/shared/ui/AdminSimpleResourcePages';
import { adminProblemTagsConfig } from 'modules/admin/shared/ui/adminSimpleResourceConfigs';

const AdminProblemTagsListPage = () => (
  <AdminSimpleResourceListPage config={adminProblemTagsConfig} />
);

export default AdminProblemTagsListPage;
