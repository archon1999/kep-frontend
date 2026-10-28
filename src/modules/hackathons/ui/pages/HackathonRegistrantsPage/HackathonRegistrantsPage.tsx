import { useTranslation } from 'react-i18next';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useHackathonRegistrantsPage } from 'modules/hackathons/application/hooks/useHackathonRegistrantsPage';
import { HackathonAsyncState, HackathonDetailLayout } from 'modules/hackathons/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import HackathonRegistrantsTable from './components/HackathonRegistrantsTable';

const HackathonRegistrantsPage = () => {
  const {
    hackathon,
    isHackathonLoading,
    hackathonError,
    registrants,
    isLoading,
    error,
    filteredRegistrants,
    search,
    setSearch,
  } = useHackathonRegistrantsPage();

  const { t } = useTranslation();

  return (
    <HackathonDetailLayout
      hackathon={hackathon}
      isLoading={isHackathonLoading}
      error={hackathonError}
    >
      <Box component="section">
        <SectionHeader
          title={t('hackathons.registrants')}
          description={t('hackathons.registrantsLead')}
          action={
            <Typography variant="caption" color="text.secondary">
              {t('hackathons.participantsCount', { count: registrants?.length ?? 0 })}
            </Typography>
          }
        />
        <Box sx={{ px: { xs: 2.5, md: 4 }, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <DebouncedTextField
            textFieldComponent={TextField}
            value={search}
            onValueChange={setSearch}
            placeholder={t('hackathons.registrantsSearchPlaceholder')}
            size="small"
            sx={{ width: { xs: 1, sm: 280 } }}
            slotProps={{
              htmlInput: { 'aria-label': t('hackathons.registrantsSearchPlaceholder') },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon
                      icon="material-symbols:search-rounded"
                      sx={{ color: 'text.secondary', fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearch('')}
                      aria-label={t('hackathons.clearRegistrantSearch')}
                    >
                      <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />
        </Box>
        {isLoading || error || !filteredRegistrants.length ? (
          <HackathonAsyncState
            isLoading={isLoading}
            error={error}
            isEmpty={!filteredRegistrants.length}
            emptyTitle={
              search.trim() ? t('hackathons.noMatchingRegistrants') : t('hackathons.noRegistrants')
            }
            emptyMessage={search.trim() ? t('hackathons.noMatchingRegistrantsHint') : undefined}
          />
        ) : (
          <HackathonRegistrantsTable registrants={filteredRegistrants} />
        )}
      </Box>
    </HackathonDetailLayout>
  );
};

export default HackathonRegistrantsPage;
