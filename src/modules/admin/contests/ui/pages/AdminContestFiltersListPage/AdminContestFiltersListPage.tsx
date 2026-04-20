import { AdminSimpleResourceListPage } from 'modules/admin/shared/ui/AdminSimpleResourcePages';
import { adminContestFiltersConfig } from 'modules/admin/shared/ui/adminSimpleResourceConfigs';

const AdminContestFiltersListPage = () => (
  <AdminSimpleResourceListPage config={adminContestFiltersConfig} />
);

export default AdminContestFiltersListPage;
