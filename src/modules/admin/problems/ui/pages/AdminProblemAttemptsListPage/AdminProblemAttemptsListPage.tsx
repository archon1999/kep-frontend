import { AdminSimpleResourceListPage } from 'modules/admin/shared/ui/AdminSimpleResourcePages';
import { adminProblemAttemptsConfig } from 'modules/admin/shared/ui/adminSimpleResourceConfigs';

const AdminProblemAttemptsListPage = () => (
  <AdminSimpleResourceListPage config={adminProblemAttemptsConfig} />
);

export default AdminProblemAttemptsListPage;
