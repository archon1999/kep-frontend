import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import EmptyState from 'shared/components/common/EmptyState';

const AuthUnavailable = () => {
  const { t } = useTranslation();
  const { refreshCurrentUser } = useAuth();
  return (
    <EmptyState
      kind="error"
      title={t('common.session.unavailable')}
      description={t('common.session.retryDescription')}
      action={
        <Button onClick={() => void refreshCurrentUser().catch(() => {})}>
          {t('common.retry')}
        </Button>
      }
    />
  );
};
export default AuthUnavailable;
