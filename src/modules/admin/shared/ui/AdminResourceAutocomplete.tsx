import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Autocomplete, Avatar, Stack, TextField, TextFieldProps, Typography } from '@mui/material';
import { adminApiClient } from '../data-access/adminApiClient';

export interface AdminAutocompleteOption {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  title?: string;
  name?: string;
  code?: string;
}

interface AdminResourceAutocompleteProps<TOption extends AdminAutocompleteOption = AdminAutocompleteOption> {
  resource: string;
  value: TOption | null;
  onChange: (value: TOption | null) => void;
  label: string;
  placeholder?: string;
  textFieldProps?: TextFieldProps;
  getOptionLabel?: (option: TOption) => string;
  getOptionSecondaryLabel?: (option: TOption) => string | undefined;
  showAvatar?: boolean;
}

const defaultGetOptionLabel = (option: AdminAutocompleteOption) =>
  option.username ?? option.title ?? option.name ?? option.code ?? `#${option.id}`;

const defaultGetOptionSecondaryLabel = (option: AdminAutocompleteOption) => {
  if (option.firstName || option.lastName || option.email) {
    return [option.firstName, option.lastName].filter(Boolean).join(' ') || option.email;
  }

  if (option.code && option.name) {
    return option.code;
  }

  return option.id ? `#${option.id}` : undefined;
};

const getUserOptionLabel = (option: AdminAutocompleteOption) => option.username ?? `#${option.id}`;

const getTitledOptionLabel = (option: AdminAutocompleteOption) =>
  option.title ?? option.name ?? `#${option.id}`;

const getTeamOptionLabel = (option: AdminAutocompleteOption) =>
  option.name ?? option.code ?? `#${option.id}`;

const AdminResourceAutocomplete = <TOption extends AdminAutocompleteOption = AdminAutocompleteOption>({
  resource,
  value,
  onChange,
  label,
  placeholder,
  textFieldProps,
  getOptionLabel = defaultGetOptionLabel as (option: TOption) => string,
  getOptionSecondaryLabel = defaultGetOptionSecondaryLabel as (option: TOption) => string | undefined,
  showAvatar = false,
}: AdminResourceAutocompleteProps<TOption>) => {
  const [inputValue, setInputValue] = useState(value ? getOptionLabel(value) : '');
  const [debouncedInputValue, setDebouncedInputValue] = useState(value ? getOptionLabel(value) : '');

  useEffect(() => {
    const nextInputValue = value ? getOptionLabel(value) : '';
    setInputValue(nextInputValue);
    setDebouncedInputValue(nextInputValue);
  }, [getOptionLabel, value]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedInputValue(inputValue), 350);
    return () => window.clearTimeout(timeoutId);
  }, [inputValue]);

  const { data, isLoading } = useSWR(
    ['admin-autocomplete', resource, debouncedInputValue],
    () =>
      adminApiClient.list<TOption>(resource, {
        page: 1,
        pageSize: 10,
        search: debouncedInputValue,
      }),
    { keepPreviousData: true, revalidateOnFocus: false },
  );

  return (
    <Autocomplete<TOption>
      options={data?.data ?? []}
      value={value}
      inputValue={inputValue}
      loading={isLoading}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, selectedValue) => option.id === selectedValue.id}
      filterOptions={(options) => options}
      onInputChange={(_, nextValue, reason) => {
        if (reason === 'reset') {
          return;
        }
        setInputValue(nextValue);
      }}
      onChange={(_, nextValue) => {
        onChange(nextValue);
        setInputValue(nextValue ? getOptionLabel(nextValue) : '');
      }}
      renderOption={(props, option) => {
        const optionLabel = getOptionLabel(option);
        const secondaryLabel = getOptionSecondaryLabel(option);

        return (
          <li {...props} key={option.id}>
            <Stack direction="row" spacing={1} alignItems="center">
              {showAvatar ? (
                <Avatar sx={{ width: 28, height: 28 }}>
                  {optionLabel.slice(0, 1).toUpperCase()}
                </Avatar>
              ) : null}
              <Stack direction="column" spacing={0} sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap>
                  {optionLabel}
                </Typography>
                {secondaryLabel ? (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {secondaryLabel}
                  </Typography>
                ) : null}
              </Stack>
            </Stack>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...textFieldProps}
          fullWidth
          label={label}
          placeholder={placeholder}
        />
      )}
      blurOnSelect
      clearOnBlur={false}
    />
  );
};

type NamedAutocompleteProps<TOption extends AdminAutocompleteOption = AdminAutocompleteOption> = Omit<
  AdminResourceAutocompleteProps<TOption>,
  'resource' | 'getOptionLabel' | 'getOptionSecondaryLabel' | 'showAvatar'
>;

export const UsersAutocomplete = <TOption extends AdminAutocompleteOption = AdminAutocompleteOption>(
  props: NamedAutocompleteProps<TOption>,
) => (
  <AdminResourceAutocomplete
    {...props}
    resource="users"
    getOptionLabel={getUserOptionLabel as (option: TOption) => string}
    showAvatar
  />
);

export const ProblemsAutocomplete = <TOption extends AdminAutocompleteOption = AdminAutocompleteOption>(
  props: NamedAutocompleteProps<TOption>,
) => (
  <AdminResourceAutocomplete
    {...props}
    resource="problems"
    getOptionLabel={getTitledOptionLabel as (option: TOption) => string}
  />
);

export const ContestsAutocomplete = <TOption extends AdminAutocompleteOption = AdminAutocompleteOption>(
  props: NamedAutocompleteProps<TOption>,
) => (
  <AdminResourceAutocomplete
    {...props}
    resource="contests"
    getOptionLabel={getTitledOptionLabel as (option: TOption) => string}
  />
);

export const TeamsAutocomplete = <TOption extends AdminAutocompleteOption = AdminAutocompleteOption>(
  props: NamedAutocompleteProps<TOption>,
) => (
  <AdminResourceAutocomplete
    {...props}
    resource="users/teams"
    getOptionLabel={getTeamOptionLabel as (option: TOption) => string}
  />
);

export default AdminResourceAutocomplete;
