import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { useHackathonAttemptsPage } from 'modules/hackathons/application/hooks/useHackathonAttemptsPage';
import { HackathonAsyncState, HackathonDetailLayout } from 'modules/hackathons/ui/shared';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import HackathonAttemptsTable from './components/HackathonAttemptsTable';

const HackathonAttemptsPage = () => {
  const {
    state,
    setField,
    hackathon,
    isHackathonLoading,
    hackathonError,
    data,
    isLoading,
    error,
    mutate,
  } = useHackathonAttemptsPage();

  const { t } = useTranslation();

  return (
    <HackathonDetailLayout
      hackathon={hackathon}
      isLoading={isHackathonLoading}
      error={hackathonError}
    >
      <Box component="section">
        <SectionHeader
          title={t('hackathons.attempts')}
          description={t('hackathons.attemptsLead')}
          action={
            <Typography variant="caption" color="text.secondary">
              {t('projects.attemptsTotal', { count: data?.total ?? 0 })}
            </Typography>
          }
        />
        {isLoading || error || !data?.data.length ? (
          <HackathonAsyncState
            isLoading={isLoading}
            error={error}
            isEmpty={!data?.data.length}
            emptyTitle={t('projects.noAttempts')}
            emptyMessage={t('projects.noAttemptsHint')}
          />
        ) : (
          <HackathonAttemptsTable
            attempts={data.data}
            onRerun={() => {
              void mutate();
            }}
          />
        )}
        <ListPagination
          count={data?.pagesCount ?? 0}
          page={state.page}
          onChange={(page) => setField('page', page)}
        />
      </Box>
    </HackathonDetailLayout>
  );
};

export default HackathonAttemptsPage;
