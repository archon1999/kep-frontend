import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import FilterDrawer from 'shared/components/common/FilterDrawer';
import StyledTextField from 'shared/components/styled/StyledTextField';

export type CountryOption = {
  value: string;
  code: string;
  label: string;
};

interface UsersListFilterDrawerProps {
  open: boolean;
  handleClose: () => void;
  drawerWidth: number;
  country: string;
  ageRange: [number, number];
  hasCountry: boolean;
  hasCodeforces: boolean;
  hasTelegram: boolean;
  countryOptions: CountryOption[];
  countryOptionsByValue: Record<string, CountryOption>;
  hasActiveFilters: boolean;
  onClear: () => void;
  onCountryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAgeRangeChange: (value: [number, number]) => void;
  onHasCountryChange: (checked: boolean) => void;
  onHasCodeforcesChange: (checked: boolean) => void;
  onHasTelegramChange: (checked: boolean) => void;
}

const AGE_RANGE: [number, number] = [0, 100];

const UsersListFilterDrawer = ({
  open,
  handleClose,
  drawerWidth,
  country,
  ageRange,
  hasCountry,
  hasCodeforces,
  hasTelegram,
  countryOptions,
  countryOptionsByValue,
  hasActiveFilters,
  onClear,
  onCountryChange,
  onAgeRangeChange,
  onHasCountryChange,
  onHasCodeforcesChange,
  onHasTelegramChange,
}: UsersListFilterDrawerProps) => {
  const { t } = useTranslation();

  return (
    <FilterDrawer
      id="users-filters-drawer"
      open={open}
      onClose={handleClose}
      drawerWidth={drawerWidth}
      hasActiveFilters={hasActiveFilters}
      clearLabel={t('problems.clear')}
      onClear={onClear}
    >
      <Stack direction="column" gap={1.5}>
        <StyledTextField
          select
          fullWidth
          label={t('users.filters.country')}
          value={country}
          onChange={onCountryChange}
          placeholder={t('users.filters.countryPlaceholder')}
          SelectProps={{
            displayEmpty: true,
            renderValue: (value) => {
              const selectedValue = (value as string) || '';

              if (!selectedValue) {
                return (
                  <Typography variant="body2" color="text.secondary">
                    {t('users.filters.anyCountry')}
                  </Typography>
                );
              }

              const selectedOption = countryOptionsByValue[selectedValue];
              const label = selectedOption?.label ?? selectedValue;

              return (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CountryFlagIcon code={selectedOption?.code ?? selectedValue} size={20} />
                  <Typography variant="body2" component="span" noWrap>
                    {label}
                  </Typography>
                </Stack>
              );
            },
          }}
        >
          <MenuItem value="">
            <Typography variant="body2" color="text.secondary">
              {t('users.filters.anyCountry')}
            </Typography>
          </MenuItem>
          {countryOptions.map((countryOption) => (
            <MenuItem key={countryOption.value} value={countryOption.value}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CountryFlagIcon code={countryOption.code} size={20} />
                <Typography variant="body2" component="span" noWrap>
                  {countryOption.label}
                </Typography>
              </Stack>
            </MenuItem>
          ))}
        </StyledTextField>

        <Stack direction="column" spacing={1} sx={{ px: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {t('users.filters.age')}
          </Typography>
          <Slider
            value={ageRange}
            min={AGE_RANGE[0]}
            max={AGE_RANGE[1]}
            step={1}
            valueLabelDisplay="auto"
            onChange={(_, value) => {
              if (Array.isArray(value)) {
                onAgeRangeChange(value as [number, number]);
              }
            }}
          />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {ageRange[0]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ageRange[1]}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="column" sx={{ px: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasCountry}
                onChange={(event) => onHasCountryChange(event.target.checked)}
              />
            }
            label={t('users.filters.hasCountry')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hasCodeforces}
                onChange={(event) => onHasCodeforcesChange(event.target.checked)}
              />
            }
            label={t('users.filters.hasCodeforces')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hasTelegram}
                onChange={(event) => onHasTelegramChange(event.target.checked)}
              />
            }
            label={t('users.filters.hasTelegram')}
          />
        </Stack>
      </Stack>
    </FilterDrawer>
  );
};

export default UsersListFilterDrawer;
