import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Card,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon, useHackathonRegistrants } from 'modules/hackathons/application';
import {
  HackathonAsyncState,
  HackathonCountdownCard,
  HackathonDetailLayout,
} from 'modules/hackathons/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import HackathonRegistrantsTable from './components/HackathonRegistrantsTable';

const HackathonRegistrantsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const {
    data: hackathon,
    isLoading: isHackathonLoading,
    error: hackathonError,
  } = useHackathon(id);
  const { data: registrants, isLoading, error } = useHackathonRegistrants(id);
  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonRegistrants' : undefined,
    hackathon?.title ? { hackathonTitle: hackathon.title } : undefined,
  );

  const filteredRegistrants = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return (registrants ?? [])
      .map((registrant, index) => ({ ...registrant, position: index + 1 }))
      .filter(
        (registrant) =>
          !query ||
          `${registrant.username} ${registrant.userFullName ?? ''}`
            .toLocaleLowerCase()
            .includes(query),
      );
  }, [registrants, search]);

  return (
    <HackathonDetailLayout
      hackathon={hackathon}
      isLoading={isHackathonLoading}
      error={hackathonError}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
          <Card sx={{ borderRadius: 3 }}>
            {hackathon ? (
              <>
                <Typography
                  component="h2"
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ px: 3, pt: 3 }}
                >
                  {t('hackathons.registrants')}
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ sm: 'center' }}
                  justifyContent="space-between"
                  spacing={2}
                  sx={{ px: 3, py: 2.5 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {t('hackathons.participantsCount', { count: registrants?.length ?? 0 })}
                  </Typography>
                  <TextField
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
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
                              <IconifyIcon
                                icon="material-symbols:close-rounded"
                                sx={{ fontSize: 18 }}
                              />
                            </IconButton>
                          </InputAdornment>
                        ) : undefined,
                      },
                    }}
                  />
                </Stack>
                {isLoading || error || !filteredRegistrants.length ? (
                  <HackathonAsyncState
                    isLoading={isLoading}
                    error={error}
                    isEmpty={!filteredRegistrants.length}
                    emptyTitle={
                      search.trim()
                        ? t('hackathons.noMatchingRegistrants')
                        : t('hackathons.noRegistrants')
                    }
                    emptyMessage={
                      search.trim() ? t('hackathons.noMatchingRegistrantsHint') : undefined
                    }
                  />
                ) : (
                  <HackathonRegistrantsTable registrants={filteredRegistrants} />
                )}
              </>
            ) : (
              <HackathonAsyncState
                isLoading={isHackathonLoading}
                error={hackathonError}
                loadingHeight={180}
              />
            )}
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <HackathonCountdownCard hackathon={hackathon} />
        </Grid>
      </Grid>
    </HackathonDetailLayout>
  );
};

export default HackathonRegistrantsPage;
