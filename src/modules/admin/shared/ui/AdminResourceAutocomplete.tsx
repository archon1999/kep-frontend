import { UIEvent, useEffect, useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { Autocomplete, Avatar, Stack, Typography } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import { adminApiClient } from '../helpers/adminApiClient.ts';
import { AdminPaginatedResponse } from '../helpers/types.ts';
import AdminTextField from './AdminTextField';

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

const AUTOCOMPLETE_PAGE_SIZE = 20;
const AUTOCOMPLETE_SCROLL_THRESHOLD = 48;

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
  const [open, setOpen] = useState(false);
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

  const getAutocompleteKey = (
    pageIndex: number,
    previousPageData: AdminPaginatedResponse<TOption> | null,
  ) => {
    if (!open) {
      return null;
    }

    if (previousPageData && previousPageData.page >= previousPageData.pagesCount) {
      return null;
    }

    return ['admin-autocomplete', resource, debouncedInputValue, pageIndex + 1] as const;
  };

  const { data, isLoading, isValidating, setSize } = useSWRInfinite(
    getAutocompleteKey,
    ([, currentResource, searchTerm, page]) =>
      adminApiClient.list<TOption>(currentResource, {
        page,
        pageSize: AUTOCOMPLETE_PAGE_SIZE,
        term: searchTerm,
      }),
    {
      keepPreviousData: true,
      revalidateAll: false,
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    },
  );

  const loadedOptions = useMemo(() => {
    const uniqueOptions = new Map<number, TOption>();

    if (value) {
      uniqueOptions.set(value.id, value);
    }

    (data ?? []).forEach((page) => {
      page.data.forEach((option) => uniqueOptions.set(option.id, option));
    });

    return Array.from(uniqueOptions.values());
  }, [data, value]);

  const lastPage = data?.[data.length - 1];
  const hasMore = Boolean(lastPage && lastPage.page < lastPage.pagesCount);
  const loading = isLoading || isValidating;

  const handleListboxScroll = (event: UIEvent<HTMLUListElement>) => {
    if (!hasMore || loading) {
      return;
    }

    const listboxNode = event.currentTarget;
    const distanceToBottom =
      listboxNode.scrollHeight - listboxNode.scrollTop - listboxNode.clientHeight;

    if (distanceToBottom <= AUTOCOMPLETE_SCROLL_THRESHOLD) {
      setSize((size) => size + 1);
    }
  };

  return (
    <Autocomplete<TOption>
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={loadedOptions}
      value={value}
      inputValue={inputValue}
      loading={loading}
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
      slotProps={{
        listbox: {
          onScroll: handleListboxScroll,
        },
      }}
      renderInput={(params) => (
        <AdminTextField
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
