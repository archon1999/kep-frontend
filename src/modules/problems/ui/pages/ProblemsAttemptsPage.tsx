import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import { usersApiClient } from 'modules/users/data-access/api/users.client';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import OnlyMeSwitch from 'shared/components/common/OnlyMeSwitch';
import FilterButton from 'shared/components/common/FilterButton';
import PageHeader from 'shared/components/sections/common/PageHeader';
import StyledTextField from 'shared/components/styled/StyledTextField';
import useGridPagination from 'shared/hooks/useGridPagination';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import useSWR from 'swr';
import { problemsQueries, useAttemptVerdicts, useAttemptsList, useProblemLanguages } from '../../application/queries';
import { AttemptsListParams } from '../../domain/ports/problems.repository';
import ProblemsAttemptsTable from '../components/ProblemsAttemptsTable.tsx';


interface AttemptsFilterState {
  username: string;
  problemId: string;
  verdict: string;
  lang: string;
}

const ProblemsAttemptsPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const params = useParams<{ username?: string }>();
  const [searchParams] = useSearchParams();
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<null | HTMLElement>(null);

  const initialFilter: AttemptsFilterState = {
    username: params.username ?? searchParams.get('username') ?? '',
    problemId: searchParams.get('problemId') ?? '',
    verdict: searchParams.get('verdict') ?? '',
    lang: searchParams.get('lang') ?? '',
  };

  const [filter, setFilter] = useState<AttemptsFilterState>(initialFilter);
  const {
    paginationModel,
    onPaginationModelChange,
    pageParams,
    setPaginationModel,
  } = useGridPagination({ initialPageSize: 20 });
  const [problemInput, setProblemInput] = useState('');
  const [userInput, setUserInput] = useState('');

  const requestParams = useMemo<AttemptsListParams>(() => {
    const problemId = filter.problemId.trim() ? Number(filter.problemId) : NaN;
    const verdict = filter.verdict.trim() ? Number(filter.verdict) : NaN;

    return {
      username: filter.username || undefined,
      problemId: Number.isNaN(problemId) ? undefined : problemId,
      verdict: Number.isNaN(verdict) ? undefined : verdict,
      lang: filter.lang || undefined,
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering: '-id',
    };
  }, [filter, pageParams.page, pageParams.pageSize]);

  const { data: attemptsPage, isLoading, mutate } = useAttemptsList(requestParams);
  const { data: languages } = useProblemLanguages();
  const { data: verdictOptions } = useAttemptVerdicts();

  const attempts = attemptsPage?.data ?? [];
  const total = attemptsPage?.total ?? 0;

  const handleFilterChange = <K extends keyof AttemptsFilterState>(
    key: K,
    value: AttemptsFilterState[K],
  ) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleReset = () => {
    setFilter({ username: '', problemId: '', verdict: '', lang: '' });
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const filtersOpen = Boolean(filtersAnchorEl);
  const isOnlyMyAttempts = Boolean(currentUser?.username && filter.username === currentUser.username);

  const problemSuggestionsFetcher = async ([, search]: [string, string]) => {
    const term = (search ?? '').trim();
    const pageResult = await problemsQueries.problemsRepository.list({
      search: term || undefined,
      page: 1,
      pageSize: 10,
      ordering: 'id',
    });
    return pageResult.data.map((item): { id: number; title: string } => ({
      id: item.id,
      title: item.title,
    }));
  };

  const userSuggestionsFetcher = async ([, search]: [string, string]) => {
    const term = (search ?? '').trim();
    const response = await usersApiClient.list({
      page: 1,
      pageSize: 10,
      search: term || undefined,
    });
    return (response?.data ?? []).map((item) => ({
      username: item.username ?? '',
      fullName: `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim(),
      avatar: item.avatar ?? (item as any).photo,
    }));
  };

  const { data: problemOptions = [] } = useSWR(
    ['attempts-problem-options', problemInput],
    problemSuggestionsFetcher,
  );
  const { data: userOptions = [] } = useSWR(
    ['attempts-user-options', userInput],
    userSuggestionsFetcher,
  );

  const selectedProblem = useMemo(
    () =>
      problemOptions.find((option) => String(option.id) === filter.problemId) ??
      (filter.problemId
        ? {
            id: Number(filter.problemId),
            title: `${filter.problemId}`,
          }
        : null),
    [problemOptions, filter.problemId],
  );

  const selectedUser = useMemo(() => {
    if (!filter.username) return null;
    return (
      userOptions.find((option) => option.username === filter.username) ?? {
        username: filter.username,
        fullName: '',
        avatar: '',
      }
    );
  }, [userOptions, filter.username]);

  return (
    <Stack direction="column" spacing={3}>
      <PageHeader
        title={t('problems.attempts.title')}
        breadcrumb={[
          { label: t('problems.title'), url: resources.Problems },
          { label: t('problems.attempts.title'), active: true },
        ]}
        actionComponent={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <OnlyMeSwitch
              label={t('problems.attempts.onlyMy')}
              checked={isOnlyMyAttempts}
              onChange={(_, checked) => {
                if (!currentUser?.username) return;
                handleFilterChange('username', checked ? currentUser.username : '');
              }}
              disabled={!currentUser?.username}
            />

            <Tooltip title={t('problems.attempts.refresh')}>
              <Button variant="soft" color="neutral" onClick={() => mutate()}>
                <IconifyIcon icon="mdi:reload" width={18} height={18} />
              </Button>
            </Tooltip>
            <FilterButton
              id="attempts-filters-button"
              onClick={(event) => setFiltersAnchorEl(event.currentTarget)}
              aria-haspopup="true"
              aria-expanded={filtersOpen ? 'true' : undefined}
              aria-controls={filtersOpen ? 'attempts-filters-menu' : undefined}
              label={t('problems.filterTitle')}
            />
            {((filter.username && filter.username !== currentUser?.username) || filter.problemId || filter.verdict || filter.lang) && (
              <Tooltip title={t('problems.attempts.clear')}>
                <Button variant="outlined" color="error" size="small" onClick={handleReset}>
                  <IconifyIcon icon="mdi:close" width={18} height={18} />
                </Button>
              </Tooltip>
            )}
          </Stack>
        }
      />

      <Menu
        id="attempts-filters-menu"
        anchorEl={filtersAnchorEl}
        open={filtersOpen}
        onClose={() => setFiltersAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ disablePadding: true }}
        PaperProps={{ sx: { p: 2, width: 360 } }}
      >
        <Stack direction="column" spacing={2}>
          <Autocomplete
            options={problemOptions}
            value={selectedProblem}
            onChange={(_, value) => handleFilterChange('problemId', value ? String(value.id) : '')}
            onInputChange={(_, value) => setProblemInput(value)}
            getOptionLabel={(option) => `${option.id}. ${option.title}`.trim()}
            filterOptions={(opts) => opts}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={700}>
                    {option.id}
                  </Typography>
                  <Typography variant="body2">{option.title}</Typography>
                </Stack>
              </li>
            )}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label={t('problems.attempts.problem')}
                placeholder="1234"
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            blurOnSelect
            clearOnBlur={false}
          />

          <Autocomplete
            options={userOptions}
            value={selectedUser}
            onChange={(_, value) => handleFilterChange('username', value?.username ?? '')}
            onInputChange={(_, value) => setUserInput(value)}
            getOptionLabel={(option) =>
              option.fullName ? `${option.username} (${option.fullName})` : option.username
            }
            filterOptions={(opts) => opts}
            renderOption={(props, option) => (
              <li {...props} key={option.username}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    src={option.avatar}
                    alt={option.username}
                    sx={{ width: 28, height: 28 }}
                  />
                  <Stack direction="row" spacing={0.25}>
                    <Typography variant="body2" fontWeight={700}>
                      {option.username}
                    </Typography>
                    {option.fullName ? (
                      <Typography variant="caption" color="text.secondary">
                        {option.fullName}
                      </Typography>
                    ) : null}
                  </Stack>
                </Stack>
              </li>
            )}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label={t('problems.attempts.user')}
                placeholder="username"
              />
            )}
            isOptionEqualToValue={(option, value) => option.username === value.username}
            blurOnSelect
            clearOnBlur={false}
          />

          <FormControl fullWidth size="small">
            <InputLabel>{t('problems.attempts.language')}</InputLabel>
            <Select
              label={t('problems.attempts.language')}
              value={filter.lang}
              onChange={(event) => handleFilterChange('lang', event.target.value)}
            >
              <MenuItem value="">{t('problems.attempts.anyLanguage')}</MenuItem>
              {(languages ?? []).map((lang) => (
                <MenuItem key={lang.lang} value={lang.lang}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={lang.lang.toUpperCase()} size="small" />
                    <Typography variant="body2">{lang.langFull}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>{t('problems.attempts.verdict')}</InputLabel>
            <Select
              label={t('problems.attempts.verdict')}
              value={filter.verdict}
              onChange={(event) => handleFilterChange('verdict', event.target.value)}
            >
              <MenuItem value="">{t('problems.attempts.anyVerdict')}</MenuItem>
              {(verdictOptions ?? []).map((option) => (
                <MenuItem key={option.value} value={String(option.value)}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Menu>

      <Box sx={{...responsivePagePaddingSx, py: {md: 0}}}>
        <ProblemsAttemptsTable
          attempts={attempts}
          total={total}
          paginationModel={paginationModel}
          onPaginationChange={onPaginationModelChange}
          isLoading={isLoading}
          onRerun={() => mutate()}
        />
      </Box>
    </Stack>
  );
};

export default ProblemsAttemptsPage;
