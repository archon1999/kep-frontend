import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete, Avatar, Chip, MenuItem, Stack, Typography } from '@mui/material';
import {
  AttemptFilterOption,
  ProblemLanguageOption,
} from 'modules/problems/domain/entities/problem.entity.ts';
import FilterDrawer from 'shared/components/common/FilterDrawer.tsx';
import VerdictSelect from 'shared/components/problems/VerdictSelect.tsx';
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
  testCaseNumberInput: string;
  hasActiveFilters: boolean;
  onChange: <K extends keyof AttemptsFilterState>(key: K, value: AttemptsFilterState[K]) => void;
  onTestCaseNumberInputChange: (value: string) => void;
  onClear: () => void;
  setSelectedProblemOption: Dispatch<SetStateAction<ProblemOption | null>>;
  setProblemInput: Dispatch<SetStateAction<string>>;
  setUserInput: Dispatch<SetStateAction<string>>;
}

const testCaseNumberOperators = [
  { value: 'lt', label: '<' },
  { value: 'exact', label: '=' },
  { value: 'gt', label: '>' },
] as const;

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
  testCaseNumberInput,
  hasActiveFilters,
  onChange,
  onTestCaseNumberInputChange,
  onClear,
  setSelectedProblemOption,
  setProblemInput,
  setUserInput,
}: ProblemsAttemptsFilterDrawerProps) => {
  const { t } = useTranslation();

  return (
    <FilterDrawer
      id="attempts-filters-drawer"
      open={open}
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
            setSelectedProblemOption(value);
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
            <StyledTextField {...params} label={t('problems.attempts.problem')} />
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
                <Stack direction="column" spacing={0}>
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
            <StyledTextField {...params} label={t('problems.attempts.user')} />
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

        <VerdictSelect
          label={t('problems.attempts.verdict')}
          value={filter.verdict}
          options={verdictOptions}
          anyLabel={t('problems.attempts.anyVerdict')}
          onChange={(value) => onChange('verdict', value)}
        />

        <Stack direction="row" spacing={1} alignItems="flex-end">
          <StyledTextField
            select
            label={t('problems.attempts.testCaseNumberOperator')}
            value={filter.testCaseNumberOperator}
            sx={{ width: 88, flexShrink: 0 }}
            onChange={(event) =>
              onChange(
                'testCaseNumberOperator',
                event.target.value as AttemptsFilterState['testCaseNumberOperator'],
              )
            }
          >
            {testCaseNumberOperators.map((operator) => (
              <MenuItem key={operator.value} value={operator.value}>
                {operator.label}
              </MenuItem>
            ))}
          </StyledTextField>
          <StyledTextField
            type="number"
            label={t('problems.attempts.testCaseNumber')}
            value={testCaseNumberInput}
            fullWidth
            disabledSpinButton
            onChange={(event) => onTestCaseNumberInputChange(event.target.value)}
          />
        </Stack>
      </Stack>
    </FilterDrawer>
  );
};

export default ProblemsAttemptsFilterDrawer;
