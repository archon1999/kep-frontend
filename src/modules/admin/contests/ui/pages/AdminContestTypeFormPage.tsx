import { AdminSimpleResourceFormPage } from 'modules/admin/shared/ui/AdminSimpleResourcePages';
import { adminContestTypesConfig } from 'modules/admin/shared/ui/adminSimpleResourceConfigs';

const AdminContestTypeFormPage = () => (
  <AdminSimpleResourceFormPage config={adminContestTypesConfig} />
);

export default AdminContestTypeFormPage;
