import { AdminSimpleResourceFormPage } from 'modules/admin/shared/ui/AdminSimpleResourcePages';
import { adminProblemTagsConfig } from 'modules/admin/shared/ui/adminSimpleResourceConfigs';

const AdminProblemTagFormPage = () => (
  <AdminSimpleResourceFormPage config={adminProblemTagsConfig} />
);

export default AdminProblemTagFormPage;
