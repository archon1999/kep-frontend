import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import { useContestAttemptsPage } from 'modules/contests/application/hooks/useContestAttemptsPage';
import ContestCountdownCard from 'modules/contests/ui/shared/components/ContestCountdownCard';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestPageLayout from 'modules/contests/ui/shared/components/ContestPageLayout';
import ProblemsAttemptsTable from 'modules/problems/ui/shared/components/ProblemsAttemptsTable.tsx';
import OnlyMeSwitch from 'shared/components/common/OnlyMeSwitch';
import VerdictSelect from 'shared/components/problems/VerdictSelect.tsx';

const ContestAttemptsPage = () => {
  const {
    currentUser,
    contest,
    isContestLoading,
    contestError,
    verdictOptions,
    filter,
    paginationModel,
    onPaginationModelChange,
    attemptsPage,
    isLoading,
    mutate,
    sectionError,
    contestId,
    handleFilterChange,
    handleReset,
    problemsOptions,
  } = useContestAttemptsPage();

  const { t } = useTranslation();

  return (
    <ContestPageLayout
      flush
      error={contestError || sectionError}
      header={
        <ContestPageHeader
          title={contest?.title ?? t('contests.tabs.attempts')}
          contest={contest}
          contestId={contestId}
          isLoading={isContestLoading}
        />
      }
    >
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, md: 9 }} sx={{ minWidth: 0 }}>
          <ProblemsAttemptsTable
            surface="section"
            paginationStyle="list"
            attempts={attemptsPage?.data ?? []}
            total={attemptsPage?.total ?? 0}
            paginationModel={paginationModel}
            onPaginationChange={onPaginationModelChange}
            isLoading={isLoading}
            onRerun={() => mutate()}
            showProblemColumn
            showContestTimeSubmitted
            disableLockedAttemptDetails
            isFiltered={Boolean(filter.contestProblem || filter.verdict || filter.userOnly)}
            getProblemLink={(attempt) =>
              getResourceByParams(resources.ContestProblem, {
                id: contest?.id ?? contestId ?? '',
                symbol: attempt.contestProblemSymbol ?? attempt.problemId?.toString() ?? '',
              })
            }
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 3 }}
          sx={{
            minWidth: 0,
            borderLeft: { md: '1px solid var(--kep-line)' },
            borderTop: { xs: '1px solid var(--kep-line)', md: 0 },
          }}
        >
          <Stack spacing={0}>
            <ContestCountdownCard contest={contest} isLoading={isContestLoading} />

            <Card variant="section">
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="label" component="h2">
                    {t('contests.filter.title')}
                  </Typography>

                  <Select
                    variant="outlined"
                    value={filter.contestProblem}
                    onChange={(event) => handleFilterChange('contestProblem', event.target.value)}
                    size="small"
                    displayEmpty
                    inputProps={{ 'aria-label': t('contests.filter.anyProblem') }}
                    MenuProps={{ slotProps: { paper: { variant: 'framed' } } }}
                    fullWidth
                  >
                    <MenuItem value="">{t('contests.filter.anyProblem')}</MenuItem>
                    {problemsOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>

                  <VerdictSelect
                    variant="outlined"
                    value={filter.verdict}
                    options={verdictOptions}
                    anyLabel={t('contests.filter.anyVerdict')}
                    onChange={(value) => handleFilterChange('verdict', value)}
                    size="small"
                  />

                  {currentUser ? (
                    <OnlyMeSwitch
                      label={t('contests.filter.onlyMe')}
                      checked={filter.userOnly}
                      onChange={(_, checked) => handleFilterChange('userOnly', checked)}
                    />
                  ) : null}

                  <Box display="flex" gap={1}>
                    <Button variant="outlined" fullWidth color="secondary" onClick={handleReset}>
                      {t('contests.filter.reset')}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </ContestPageLayout>
  );
};

export default ContestAttemptsPage;
