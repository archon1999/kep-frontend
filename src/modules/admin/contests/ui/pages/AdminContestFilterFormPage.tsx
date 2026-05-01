import { AdminSimpleResourceFormPage } from 'modules/admin/shared/ui/AdminSimpleResourcePages';
import { adminContestFiltersConfig } from 'modules/admin/shared/ui/adminSimpleResourceConfigs';

const AdminContestFilterFormPage = () => (
  <AdminSimpleResourceFormPage config={adminContestFiltersConfig} />
);

export default AdminContestFilterFormPage;
