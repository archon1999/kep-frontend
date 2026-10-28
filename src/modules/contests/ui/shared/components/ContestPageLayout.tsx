import { PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Stack } from '@mui/material';
import { Page404 } from 'modules/errors/ui/pages';
import FramedPage from 'shared/components/sections/common/FramedPage';
import { isNotFoundError } from 'shared/lib/detailRouteNotFound';

const ContestPageLayout = ({
  header,
  children,
  error,
  flush = false,
}: PropsWithChildren<{ header: ReactNode; error?: unknown; flush?: boolean }>) => {
  const { t } = useTranslation();
  if (isNotFoundError(error)) return <Page404 />;
  return (
    <FramedPage>
      {header}
      <Stack
        spacing={flush ? 0 : 3}
        sx={{ px: flush ? 0 : 'var(--kep-content-inset)', py: flush ? 0 : 3, minWidth: 0 }}
      >
        {error ? <Alert severity="error">{t('contests.detail.loadError')}</Alert> : children}
      </Stack>
    </FramedPage>
  );
};

export default ContestPageLayout;
