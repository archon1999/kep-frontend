import { AdminSimpleResourceListPage } from 'modules/admin/shared/ui/AdminSimpleResourcePages';
import { adminContestQuestionsConfig } from 'modules/admin/shared/ui/adminSimpleResourceConfigs';

const AdminContestQuestionsListPage = () => (
  <AdminSimpleResourceListPage config={adminContestQuestionsConfig} />
);

export default AdminContestQuestionsListPage;
