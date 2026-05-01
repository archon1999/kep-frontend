import { AdminSimpleResourceListPage } from 'modules/admin/shared/ui/AdminSimpleResourcePages';
import { adminContestTypesConfig } from 'modules/admin/shared/ui/adminSimpleResourceConfigs';

const AdminContestTypesListPage = () => (
  <AdminSimpleResourceListPage config={adminContestTypesConfig} />
);

export default AdminContestTypesListPage;
