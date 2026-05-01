import { AdminSimpleResourceFormPage } from 'modules/admin/shared/ui/AdminSimpleResourcePages';
import { adminProblemAttemptsConfig } from 'modules/admin/shared/ui/adminSimpleResourceConfigs';

const AdminProblemAttemptFormPage = () => (
  <AdminSimpleResourceFormPage config={adminProblemAttemptsConfig} />
);

export default AdminProblemAttemptFormPage;
