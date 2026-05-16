import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete, Avatar, Chip, MenuItem, Stack, Typography } from '@mui/material';
import {
  AttemptFilterOption,
  ProblemLanguageOption,
} from 'modules/problems/domain/entities/problem.entity.ts';
import FilterDrawer from 'shared/components/common/FilterDrawer.tsx';
import StyledTextField from 'shared/components/styled/StyledTextField.tsx';
import type { AttemptsFilterState, ProblemOption, UserOption } from '../ProblemsAttemptsPage.tsx';

interface ProblemsAttemptsFilterDrawerProps {
  open: boolean;
  handleClose: () => void;
  drawerWidth: number;
  filter: AttemptsFilterState;
  languages: ProblemLanguageOption[];
  verdictOptions: AttemptFilterOption[];
  problemOptions: ProblemOption[];
  userOptions: UserOption[];
  selectedProblem: ProblemOption | null;
  selectedUser: UserOption | null;
  hasActiveFilters: boolean;
  onChange: <K extends keyof AttemptsFilterState>(key: K, value: AttemptsFilterState[K]) => void;
  onClear: () => void;
  setProblemInput: Dispatch<SetStateAction<string>>;
  setUserInput: Dispatch<SetStateAction<string>>;
}

const ProblemsAttemptsFilterDrawer = ({
  open,
  handleClose,
  drawerWidth,
  filter,
  languages,
  verdictOptions,
  problemOptions,
  userOptions,
  selectedProblem,
  selectedUser,
  hasActiveFilters,
  onChange,
  onClear,
  setProblemInput,
  setUserInput,
}: ProblemsAttemptsFilterDrawerProps) => {
  const { t } = useTranslation();

  return (
    <FilterDrawer
      id="attempts-filters-drawer"
      open={open}
      title={t('problems.filterTitle')}
      onClose={handleClose}
      drawerWidth={drawerWidth}
      hasActiveFilters={hasActiveFilters}
      clearLabel={t('problems.clear')}
      onClear={onClear}
    >
      <Stack direction="column" gap={1}>
        <Autocomplete
          options={problemOptions}
          value={selectedProblem}
          onChange={(_, value) => {
            setProblemInput(value ? `${value.id}. ${value.title}`.trim() : '');
            onChange('problemId', value ? String(value.id) : '');
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'reset') return;
            setProblemInput(value);
          }}
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
          onChange={(_, value) => {
            setUserInput(value?.username ?? '');
            onChange('username', value?.username ?? '');
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'reset') return;
            setUserInput(value);
          }}
          getOptionLabel={(option) =>
            option.fullName ? `${option.username} (${option.fullName})` : option.username
          }
          filterOptions={(opts) => opts}
          renderOption={(props, option) => (
            <li {...props} key={option.username}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={option.avatar} alt={option.username} sx={{ width: 28, height: 28 }} />
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

        <StyledTextField
          select
          label={t('problems.attempts.language')}
          value={filter.lang}
          fullWidth
          onChange={(event) => onChange('lang', event.target.value)}
        >
          <MenuItem value="">{t('problems.attempts.anyLanguage')}</MenuItem>
          {languages.map((lang) => (
            <MenuItem key={lang.lang} value={lang.lang}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={lang.lang.toUpperCase()} size="small" />
                <Typography variant="body2">{lang.langFull}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </StyledTextField>

        <StyledTextField
          select
          label={t('problems.attempts.verdict')}
          value={filter.verdict}
          fullWidth
          onChange={(event) => onChange('verdict', event.target.value)}
        >
          <MenuItem value="">{t('problems.attempts.anyVerdict')}</MenuItem>
          {verdictOptions.map((option) => (
            <MenuItem key={option.value} value={String(option.value)}>
              {option.label}
            </MenuItem>
          ))}
        </StyledTextField>
      </Stack>
    </FilterDrawer>
  );
};

export default ProblemsAttemptsFilterDrawer;
