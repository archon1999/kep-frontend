import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import {
  Alert,
  ButtonProps,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Link,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';
import { Link as RouterLink, useNavigate, useParams } from 'react-router';
import { getResourceById } from 'app/routes/resources';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import FilterDrawer, {
  DEFAULT_FILTER_DRAWER_WIDTH,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer';
import DataGridNoRowsOverlay, {
  getDataGridNoRowsOverlaySlotProps,
  hasDataGridActiveFilters,
} from 'shared/components/common/DataGridNoRowsOverlay';
import AdminRichTextEditor from './AdminRichTextEditor';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import AttemptVerdict from 'shared/components/problems/AttemptVerdict';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import useGridPagination from 'shared/hooks/useGridPagination';
import useStableGridRowCount from 'shared/hooks/useStableGridRowCount';
import { adminApiClient } from '../helpers/adminApiClient.ts';
import { AdminChoiceOption, AdminListParams } from '../helpers/types.ts';
import AdminBatchActionsToolbar from './AdminBatchActionsToolbar';
import { AdminChoiceSelect, LanguageSelect, VerdictSelect } from './AdminChoiceSelects';
import AdminDateTimeDisplay from './AdminDateTimeDisplay';
import AdminFiltersToolbar, { AdminActiveFilter } from './AdminFiltersToolbar';
import AdminFormPageLayout from './AdminFormPageLayout';
import AdminFormSection from './AdminFormSection';
import AdminLanguageTabs, { AdminLanguageCode } from './AdminLanguageTabs';
import AdminListPageLayout from './AdminListPageLayout';
import AdminDataGridSkeletonLoadingOverlay from './AdminDataGridSkeletonLoadingOverlay';
import {
  AdminAutocompleteOption,
  ContestsAutocomplete,
  ProblemsAutocomplete,
  TeamsAutocomplete,
  UsersAutocomplete,
} from './AdminResourceAutocomplete';
import AdminRowActions, { AdminRowActionItem } from './AdminRowActions';
import TextField from './AdminTextField';
import { formatAdminEditTitle, getAdminResourceTitle } from '../utils/editTitle';
import { toNumberOrNull } from '../utils/formUtils';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getOrderingFromSortModel } from '../utils/gridSorting';
import {
  formatDateTimeLocalInputValue,
  formatDateTimePickerValue,
  parseDateTimePickerValue,
  toBackendUtcDateTime,
} from 'shared/lib/dateTime';

type AdminSimpleRow = {
  id: number | string;
  [key: string]: any;
};

type AdminFieldValueType = 'string' | 'number';
type AdminFieldSection = 'main' | 'sidebar';
type AdminAutocompleteFieldKind = 'user' | 'problem' | 'contest' | 'team';

interface AdminFilterConfig {
  name: string;
  labelKey: string;
  kind: 'text' | 'number' | 'select' | 'nullableBoolean' | AdminAutocompleteFieldKind;
  choicesKey?: string;
  valueType?: AdminFieldValueType;
}

interface AdminListColumnConfig {
  field: string;
  labelKey: string;
  width?: number;
  minWidth?: number;
  flex?: number;
  sortable?: boolean;
  type?:
    | 'text'
    | 'number'
    | 'boolean'
    | 'dateTime'
    | 'chip'
    | 'editLink'
    | 'user'
    | 'attemptVerdict'
    | 'attemptLanguage'
    | 'attemptTime'
    | 'attemptMemory';
  clientPath?: (row: AdminSimpleRow) => string | undefined;
  render?: (row: AdminSimpleRow, helpers: AdminSimpleRenderHelpers) => ReactNode;
}

interface AdminSimpleRenderHelpers {
  t: ReturnType<typeof useTranslation>['t'];
  emptyValue: string;
  meta?: Record<string, AdminChoiceOption[]>;
}

interface AdminBatchActionConfig {
  action: string;
  labelKey: string;
  icon: string;
  color?: ButtonProps['color'];
  confirmKey?: string;
}

interface AdminFormFieldConfig {
  name: string;
  labelKey: string;
  kind:
    | 'text'
    | 'number'
    | 'textarea'
    | 'checkbox'
    | 'select'
    | 'richText'
    | 'dateTime'
    | AdminAutocompleteFieldKind;
  section?: AdminFieldSection;
  choicesKey?: string;
  valueType?: AdminFieldValueType;
  nullable?: boolean;
  omitWhenEmpty?: boolean;
  required?: boolean;
  minRows?: number;
  minHeight?: number;
  usernameField?: string;
  labelField?: string;
  readOnly?: boolean;
}

interface AdminTranslatedFieldConfig {
  baseName: string;
  labelKey: string;
  kind: 'text' | 'richText';
  fallbackName?: string;
  minHeight?: number;
}

interface AdminSimpleResourceConfig {
  resource: string;
  listPath: string;
  createPath: string;
  editPath: string;
  titleKey: string;
  createButtonKey?: string;
  createTitleKey: string;
  editTitleKey: string;
  searchPlaceholderKey: string;
  selectedLabelKey: string;
  confirmDeleteKey: string;
  sidebarTitleKey: string;
  defaultValues: Record<string, any>;
  columns: AdminListColumnConfig[];
  fields: AdminFormFieldConfig[];
  translatedFields?: AdminTranslatedFieldConfig[];
  translatedSectionTitleKey?: string;
  translatedSectionSubheaderKey?: string;
  filters?: AdminFilterConfig[];
  batchActions?: AdminBatchActionConfig[];
  rowActions?: (
    row: AdminSimpleRow,
    helpers: {
      t: ReturnType<typeof useTranslation>['t'];
      runBatchAction: (ids: Array<number | string>, action: AdminBatchActionConfig) => Promise<void>;
    },
  ) => AdminRowActionItem[];
  metaResource?: string;
  defaultSortModel?: GridSortModel;
}

interface AdminSimpleResourcePageProps {
  config: AdminSimpleResourceConfig;
}

const languageFieldSuffix: Record<AdminLanguageCode, 'Uz' | 'En' | 'Ru'> = {
  uz: 'Uz',
  en: 'En',
  ru: 'Ru',
};

const defaultBatchActions: AdminBatchActionConfig[] = [
  {
    action: 'delete',
    labelKey: 'admin.actions.delete',
    icon: 'mdi:delete-outline',
    color: 'error',
    confirmKey: 'admin.confirmBatchDelete',
  },
];

const autocompleteFieldKinds: AdminAutocompleteFieldKind[] = ['user', 'problem', 'contest', 'team'];

const isAutocompleteFieldKind = (kind: AdminFormFieldConfig['kind']): kind is AdminAutocompleteFieldKind =>
  autocompleteFieldKinds.includes(kind as AdminAutocompleteFieldKind);

const getDefaultLabelField = (field: AdminFormFieldConfig) => {
  if (field.labelField) {
    return field.labelField;
  }

  if (field.kind === 'user') {
    return field.usernameField ?? `${field.name}Username`;
  }

  if (field.kind === 'problem' || field.kind === 'contest') {
    return `${field.name}Title`;
  }

  if (field.kind === 'team') {
    return `${field.name}Name`;
  }

  return field.name;
};

const buildAutocompleteOption = (
  field: AdminFormFieldConfig,
  id?: number | string | null,
  label?: string | null,
): AdminAutocompleteOption | null => {
  if (!id) {
    return null;
  }

  const option: AdminAutocompleteOption = { id: Number(id) };
  const resolvedLabel = label || `#${id}`;

  if (field.kind === 'user') {
    option.username = resolvedLabel;
  } else if (field.kind === 'problem' || field.kind === 'contest') {
    option.title = resolvedLabel;
  } else if (field.kind === 'team') {
    option.name = resolvedLabel;
  }

  return option;
};

const getAutocompleteOptionLabel = (value: AdminAutocompleteOption) =>
  value.username ?? value.title ?? value.name ?? value.code ?? `#${value.id}`;

const getChoiceOptions = (
  meta: Record<string, AdminChoiceOption[]> | undefined,
  choicesKey?: string,
) => (choicesKey ? meta?.[choicesKey] ?? [] : []);

const getRowLabelParams = (row: AdminSimpleRow) => ({
  id: row.id,
  name: row.name ?? row.title ?? row.username ?? row.code ?? row.id,
});

const getFieldValue = (form: Record<string, any>, field: AdminFormFieldConfig) => {
  const value = form[field.name];
  if (field.kind === 'dateTime') {
    return value ?? '';
  }
  if (field.kind === 'number') {
    return value ?? '';
  }
  if (field.kind === 'checkbox') {
    return Boolean(value);
  }
  return value ?? '';
};

const toPayloadFieldValue = (value: any, field: AdminFormFieldConfig) => {
  if (field.kind === 'number') {
    return field.nullable ? toNumberOrNull(value) : Number(value || 0);
  }
  if (field.kind === 'dateTime') {
    return value ? toBackendUtcDateTime(value) : null;
  }
  if (isAutocompleteFieldKind(field.kind)) {
    return value || null;
  }
  return value;
};

const AdminSimpleResourceListPage = ({ config }: AdminSimpleResourcePageProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
  const [isBatching, setIsBatching] = useState(false);
  const [sortModel, setSortModel] = useState<GridSortModel>(
    config.defaultSortModel ?? [{ field: 'id', sort: 'desc' }],
  );
  const filterDrawer = useFilterDrawer();
  const { paginationModel, onPaginationModelChange, pageParams, setPaginationModel } =
    useGridPagination({
      initialPageSize: 20,
      querySync: {
        pageKey: 'page',
        pageSizeKey: 'pageSize',
      },
    });

  const { data: meta } = useSWR<Record<string, AdminChoiceOption[]>>(
    config.metaResource ? [`admin-${config.resource}-meta`] : null,
    () => adminApiClient.meta<Record<string, AdminChoiceOption[]>>(config.metaResource ?? config.resource),
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search), 400);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const filterSignature = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearch, filterSignature, sortModel, setPaginationModel]);

  const queryParams = useMemo<AdminListParams>(() => {
    const params: AdminListParams = {
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering: getOrderingFromSortModel(sortModel),
      search: debouncedSearch,
    };

    (config.filters ?? []).forEach((filter) => {
      const value = filters[filter.name];

      if (autocompleteFieldKinds.includes(filter.kind as AdminAutocompleteFieldKind)) {
        params[filter.name] = value?.id;
      } else if (filter.kind === 'nullableBoolean') {
        params[filter.name] = value === '' || value === undefined ? undefined : value === 'true';
      } else if (filter.kind === 'number') {
        params[filter.name] = value === '' || value === undefined ? undefined : Number(value);
      } else {
        params[filter.name] = value;
      }
    });

    return params;
  }, [
    config.filters,
    debouncedSearch,
    filters,
    pageParams.page,
    pageParams.pageSize,
    sortModel,
  ]);

  const { data, isLoading, isValidating, mutate } = useSWR(
    [`admin-${config.resource}`, queryParams],
    () => adminApiClient.list<AdminSimpleRow>(config.resource, queryParams),
    { keepPreviousData: true, revalidateOnFocus: false },
  );

  const selectedIds = useMemo(
    () => Array.from(rowSelectionModel.ids).map((id) => Number(id)).filter(Number.isFinite),
    [rowSelectionModel],
  );

  const resetRowSelection = () => setRowSelectionModel({ type: 'include', ids: new Set() });

  const runBatchAction = async (
    ids: Array<number | string>,
    action: AdminBatchActionConfig,
  ) => {
    if (ids.length === 0) {
      return;
    }

    if (action.confirmKey && !window.confirm(t(action.confirmKey, { count: ids.length }))) {
      return;
    }

    setIsBatching(true);
    try {
      await adminApiClient.batch(config.resource, { ids, action: action.action });
      resetRowSelection();
      await mutate();
    } finally {
      setIsBatching(false);
    }
  };

  const handleDelete = async (row: AdminSimpleRow) => {
    if (!window.confirm(t(config.confirmDeleteKey, getRowLabelParams(row)))) {
      return;
    }

    await adminApiClient.remove(config.resource, row.id);
    await mutate();
  };

  const renderColumnValue = (column: AdminListColumnConfig, row: AdminSimpleRow) => {
    const value = row[column.field];
    const emptyValue = t('admin.emptyValue');

    if (column.render) {
      return column.render(row, { t, emptyValue, meta });
    }

    if (column.type === 'editLink') {
      return (
        <Link
          component={RouterLink}
          to={getResourceById(config.editPath, row.id)}
          underline="hover"
          fontWeight={700}
          onClick={(event) => event.stopPropagation()}
        >
          {value ?? row.id}
        </Link>
      );
    }

    if (column.clientPath) {
      const path = column.clientPath(row);

      if (path) {
        return (
          <Link
            component={RouterLink}
            to={path}
            underline="hover"
            color="text.primary"
            onClick={(event) => event.stopPropagation()}
          >
            <Typography variant="body2" fontWeight={600} noWrap>
              {value || emptyValue}
            </Typography>
          </Link>
        );
      }
    }

    if (column.type === 'boolean') {
      return <Checkbox checked={Boolean(value)} disabled />;
    }

    if (column.type === 'dateTime') {
      return <AdminDateTimeDisplay value={value} emptyValue={emptyValue} />;
    }

    if (column.type === 'chip') {
      return value ? <Chip size="small" label={value} variant="soft" /> : emptyValue;
    }

    if (column.type === 'attemptVerdict') {
      return (
        <AttemptVerdict
          verdict={row.verdict as VerdictKey | undefined}
          title={row.verdictTitle ?? row.verdictLabel ?? emptyValue}
          testCaseNumber={row.testCaseNumber}
          balls={row.balls}
        />
      );
    }

    if (column.type === 'attemptLanguage') {
      return row.lang ? (
        <AttemptLanguage lang={row.lang} langFull={row.langFull ?? row.langLabel} />
      ) : (
        <Typography color="text.secondary">{emptyValue}</Typography>
      );
    }

    if (column.type === 'attemptTime' || column.type === 'attemptMemory') {
      const unitKey = column.type === 'attemptTime' ? 'problems.attempts.ms' : 'problems.attempts.kb';

      return (
        <Typography variant="body2" fontWeight={600}>
          {value ?? emptyValue} {t(unitKey)}
        </Typography>
      );
    }

    if (column.type === 'user') {
      return value ? (
        <UserPopover username={value}>
          <Typography color="primary" fontWeight={600} variant="body2" noWrap>
            {value}
          </Typography>
        </UserPopover>
      ) : (
        <Typography color="text.secondary">{emptyValue}</Typography>
      );
    }

    return value ?? emptyValue;
  };

  const columns: GridColDef<AdminSimpleRow>[] = useMemo(() => {
    const listColumns = config.columns.map<GridColDef<AdminSimpleRow>>((column) => ({
      field: column.field,
      headerName: t(column.labelKey),
      width: column.width,
      minWidth: column.minWidth,
      flex: column.flex,
      sortable: column.sortable ?? true,
      renderCell: ({ row }) => renderColumnValue(column, row),
    }));

    return [
      ...listColumns,
      {
        field: 'actions',
        headerName: t('admin.columns.actions'),
        width: 90,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <AdminRowActions
            label={t('admin.columns.actions')}
            actions={[
              {
                label: t('admin.actions.edit'),
                icon: 'mdi:pencil-outline',
                to: getResourceById(config.editPath, row.id),
              },
              ...(config.rowActions?.(row, { t, runBatchAction }) ?? []),
              {
                label: t('admin.actions.delete'),
                icon: 'mdi:delete-outline',
                color: 'error',
                onClick: () => handleDelete(row),
              },
            ]}
          />
        ),
      },
    ];
  }, [config, meta, t]);

  const renderAutocompleteFilter = (filter: AdminFilterConfig) => {
    const props = {
      key: filter.name,
      value: filters[filter.name] ?? null,
      onChange: (value: AdminAutocompleteOption | null) =>
        setFilters((prev) => ({ ...prev, [filter.name]: value })),
      label: t(filter.labelKey),
      placeholder: '',
    };

    if (filter.kind === 'problem') {
      return <ProblemsAutocomplete {...props} />;
    }

    if (filter.kind === 'contest') {
      return <ContestsAutocomplete {...props} />;
    }

    if (filter.kind === 'team') {
      return <TeamsAutocomplete {...props} />;
    }

    return (
      <UsersAutocomplete
        {...props}
        placeholder={t('admin.form.placeholders.username')}
      />
    );
  };

  const renderFilter = (filter: AdminFilterConfig) => {
    if (autocompleteFieldKinds.includes(filter.kind as AdminAutocompleteFieldKind)) {
      return renderAutocompleteFilter(filter);
    }

    if (filter.kind === 'select') {
      return (
        <AdminChoiceSelect
          key={filter.name}
          label={t(filter.labelKey)}
          value={filters[filter.name] ?? ''}
          onChange={(value) => setFilters((prev) => ({ ...prev, [filter.name]: value }))}
          options={getChoiceOptions(meta, filter.choicesKey)}
          nullable
          emptyLabel={t('admin.filters.all')}
          valueType={filter.valueType}
          fullWidth
        />
      );
    }

    if (filter.kind === 'nullableBoolean') {
      return (
        <AdminChoiceSelect
          key={filter.name}
          label={t(filter.labelKey)}
          value={filters[filter.name] ?? ''}
          onChange={(value) => setFilters((prev) => ({ ...prev, [filter.name]: value }))}
          options={[
            { value: 'true', label: t('admin.status.yes') },
            { value: 'false', label: t('admin.status.no') },
          ]}
          nullable
          emptyLabel={t('admin.filters.all')}
          fullWidth
        />
      );
    }

    return (
      <TextField
        key={filter.name}
        placeholder=""
        type={filter.kind === 'number' ? 'number' : 'text'}
        label={t(filter.labelKey)}
        value={filters[filter.name] ?? ''}
        onChange={(event) => setFilters((prev) => ({ ...prev, [filter.name]: event.target.value }))}
        fullWidth
      />
    );
  };

  const activeFilters = useMemo<AdminActiveFilter[]>(() => {
    const removeFilter = (name: string) => {
      setFilters((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    };

    return (config.filters ?? []).flatMap((filter) => {
      const value = filters[filter.name];

      if (value === undefined || value === null || value === '') {
        return [];
      }

      if (Array.isArray(value) && value.length === 0) {
        return [];
      }

      let valueLabel = String(value);

      if (autocompleteFieldKinds.includes(filter.kind as AdminAutocompleteFieldKind)) {
        valueLabel = getAutocompleteOptionLabel(value as AdminAutocompleteOption);
      } else if (filter.kind === 'select') {
        valueLabel =
          getChoiceOptions(meta, filter.choicesKey).find((option) => option.value === value)?.label ??
          String(value);
      } else if (filter.kind === 'nullableBoolean') {
        valueLabel = value === 'true' ? t('admin.status.yes') : t('admin.status.no');
      }

      return [
        {
          key: filter.name,
          label: `${t(filter.labelKey)}: ${valueLabel}`,
          onRemove: () => removeFilter(filter.name),
        },
      ];
    });
  }, [config.filters, filters, meta, t]);

  const handleClearFilters = () => setFilters({});
  const batchActions = config.batchActions ?? defaultBatchActions;
  const filterControls = config.filters?.length ? (
    <Stack direction="column" spacing={2.5}>{config.filters.map(renderFilter)}</Stack>
  ) : null;
  const filtersId = `admin-${config.resource.replace(/[^a-z0-9]+/gi, '-')}`;

  const isGridLoading = isLoading || (isValidating && !data);
  const rowCount = useStableGridRowCount(data?.total, isGridLoading);

  return (
    <AdminListPageLayout
      title={t(config.titleKey)}
      createPath={config.createPath}
      createLabel={config.createButtonKey ? t(config.createButtonKey) : undefined}
      search={search}
      onSearchChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
      searchPlaceholder={t(config.searchPlaceholderKey)}
      filterDrawerOpen={filterDrawer.open}
      filterDrawerWidth={DEFAULT_FILTER_DRAWER_WIDTH}
      filterDrawer={
        filterControls ? (
          <FilterDrawer
            id={`${filtersId}-filters-drawer`}
            open={filterDrawer.open}
            onClose={filterDrawer.close}
            drawerWidth={DEFAULT_FILTER_DRAWER_WIDTH}
            hasActiveFilters={activeFilters.length > 0}
            clearLabel={t('problems.clear')}
            onClear={handleClearFilters}
          >
            {filterControls}
          </FilterDrawer>
        ) : undefined
      }
      toolbar={
        filterControls ? (
          <AdminFiltersToolbar
            id={filtersId}
            search={search}
            onSearchChange={(event) => setSearch(event.target.value)}
            searchPlaceholder={t(config.searchPlaceholderKey)}
            filters={filterControls}
            activeFilters={activeFilters}
            onClearFilters={handleClearFilters}
            filtersOpen={filterDrawer.open}
            onToggleFilters={filterDrawer.toggle}
          />
        ) : undefined
      }
    >
      <AdminBatchActionsToolbar
        selectedCount={selectedIds.length}
        selectedLabel={t(config.selectedLabelKey)}
        disabled={isBatching}
        onClear={resetRowSelection}
        actions={batchActions.map((action) => ({
          label: t(action.labelKey),
          icon: action.icon,
          color: action.color,
          onClick: () => runBatchAction(selectedIds, action),
        }))}
      />
      <DataGrid
        autoHeight
        rows={data?.data ?? []}
        rowCount={rowCount}
        loading={isGridLoading}
        slots={{
          loadingOverlay: AdminDataGridSkeletonLoadingOverlay,
          noRowsOverlay: DataGridNoRowsOverlay,
        }}
        localeText={{
          noRowsLabel: t('common.dataGrid.noRows.adminResources', {
            resource: t(config.titleKey).toLowerCase(),
          }),
        }}
        slotProps={getDataGridNoRowsOverlaySlotProps({
          filtered: hasDataGridActiveFilters({ search: debouncedSearch, ...filters }),
        })}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 20, 50]}
        paginationMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        sortingMode="server"
        checkboxSelection
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={setRowSelectionModel}
        disableRowSelectionExcludeModel
        disableRowSelectionOnClick
      />
    </AdminListPageLayout>
  );
};

const AdminSimpleResourceFormPage = ({ config }: AdminSimpleResourcePageProps) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState<Record<string, any>>(config.defaultValues);
  const [selectedAutocompleteOptions, setSelectedAutocompleteOptions] = useState<
    Record<string, AdminAutocompleteOption | null>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useSWR<AdminSimpleRow>(
    isEdit && id ? [`admin-${config.resource}`, id] : null,
    () => adminApiClient.read<AdminSimpleRow>(config.resource, id!),
    { revalidateOnFocus: false },
  );

  const { data: meta } = useSWR<Record<string, AdminChoiceOption[]>>(
    config.metaResource ? [`admin-${config.resource}-meta`] : null,
    () => adminApiClient.meta<Record<string, AdminChoiceOption[]>>(config.metaResource ?? config.resource),
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (data) {
      const nextForm = { ...config.defaultValues, ...data };

      config.fields.forEach((field) => {
        if (field.kind === 'dateTime') {
          nextForm[field.name] = formatDateTimeLocalInputValue(data[field.name]);
        }
      });

      setForm(nextForm);

      const nextAutocompleteOptions: Record<string, AdminAutocompleteOption | null> = {};
      config.fields
        .filter((field) => isAutocompleteFieldKind(field.kind))
        .forEach((field) => {
          nextAutocompleteOptions[field.name] = buildAutocompleteOption(
            field,
            data[field.name],
            data[getDefaultLabelField(field)],
          );
        });
      setSelectedAutocompleteOptions(nextAutocompleteOptions);
    }
  }, [config.defaultValues, config.fields, data]);

  const setField = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => {
    const payload: Record<string, any> = {};

    config.fields.forEach((field) => {
      if (field.readOnly) {
        return;
      }
      if (field.omitWhenEmpty && (form[field.name] === '' || form[field.name] === null || form[field.name] === undefined)) {
        return;
      }
      payload[field.name] = toPayloadFieldValue(form[field.name], field);
    });

    (config.translatedFields ?? []).forEach((field) => {
      const values = (['Uz', 'En', 'Ru'] as const).map((suffix) => ({
        name: `${field.baseName}${suffix}`,
        value: form[`${field.baseName}${suffix}`] ?? '',
      }));

      values.forEach(({ name, value }) => {
        payload[name] = value;
      });

      if (field.fallbackName) {
        payload[field.fallbackName] =
          form[field.fallbackName] || values.find(({ value }) => value)?.value || '';
      }
    });

    return payload;
  };

  const handleSave = async () => {
    const requiredField = config.fields.find((field) => field.required && !form[field.name]);

    if (requiredField) {
      setError(t('admin.form.validation.required', { field: t(requiredField.labelKey) }));
      return;
    }

    const payload = buildPayload();
    setIsSaving(true);
    setError(null);

    try {
      if (isEdit && id) {
        await adminApiClient.update(config.resource, id, payload);
      } else {
        await adminApiClient.create(config.resource, payload);
      }
      navigate(config.listPath);
    } catch (caughtError: any) {
      setError(JSON.stringify(caughtError?.data ?? caughtError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm(t(config.confirmDeleteKey, { id }))) {
      return;
    }

    await adminApiClient.remove(config.resource, id);
    navigate(config.listPath);
  };

  const renderField = (field: AdminFormFieldConfig) => {
    if (field.kind === 'checkbox') {
      return (
        <FormControlLabel
          key={field.name}
          control={
            <Switch
              checked={Boolean(form[field.name])}
              onChange={(event) => setField(field.name, event.target.checked)}
            />
          }
          label={t(field.labelKey)}
        />
      );
    }

    if (field.kind === 'select') {
      const SelectComponent =
        field.choicesKey === 'verdicts'
          ? VerdictSelect
          : field.choicesKey === 'languages'
            ? LanguageSelect
            : AdminChoiceSelect;

      return (
        <SelectComponent
          key={field.name}
          label={t(field.labelKey)}
          value={getFieldValue(form, field)}
          onChange={(value) => setField(field.name, value)}
          options={getChoiceOptions(meta, field.choicesKey)}
          nullable={field.nullable}
          emptyLabel={t('admin.emptyValue')}
          valueType={field.valueType}
          fullWidth
        />
      );
    }

    if (isAutocompleteFieldKind(field.kind)) {
      const props = {
        value: selectedAutocompleteOptions[field.name] ?? null,
        onChange: (value: AdminAutocompleteOption | null) => {
          setSelectedAutocompleteOptions((prev) => ({ ...prev, [field.name]: value }));
          setField(field.name, value?.id ?? null);
        },
        label: t(field.labelKey),
        placeholder: field.kind === 'user' ? t('admin.form.placeholders.username') : t('admin.searchPlaceholder'),
      };

      if (field.kind === 'problem') {
        return <ProblemsAutocomplete key={field.name} {...props} />;
      }

      if (field.kind === 'contest') {
        return <ContestsAutocomplete key={field.name} {...props} />;
      }

      if (field.kind === 'team') {
        return <TeamsAutocomplete key={field.name} {...props} />;
      }

      return <UsersAutocomplete key={field.name} {...props} />;
    }

    if (field.kind === 'richText') {
      return (
        <Stack key={field.name} spacing={1}>
          <Typography variant="subtitle2">{t(field.labelKey)}</Typography>
          <AdminRichTextEditor
            value={form[field.name] ?? ''}
            onChange={(value) => setField(field.name, value)}
            minHeight={field.minHeight ?? 180}
            compact
            enableMathJax
            mathJaxPromptText={t('admin.form.prompts.mathJax')}
          />
        </Stack>
      );
    }

    if (field.kind === 'dateTime') {
      const fieldValue = getFieldValue(form, field);
      const fieldValueAsDate =
        typeof fieldValue === 'string' ? parseDateTimePickerValue(fieldValue) : null;

      return (
        <DateTimePicker
          key={field.name}
          label={t(field.labelKey)}
          value={fieldValueAsDate}
          onChange={(value) =>
            setField(field.name, formatDateTimePickerValue(value))
          }
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              InputLabelProps: { shrink: Boolean(fieldValue) },
            },
            popper: { placement: 'bottom-start' },
          }}
        />
      );
    }

    return (
      <TextField
        key={field.name}
        label={t(field.labelKey)}
        value={getFieldValue(form, field)}
        type={field.kind === 'number' ? 'number' : 'text'}
        onChange={(event) =>
          setField(
            field.name,
            field.kind === 'number'
              ? field.nullable
                ? toNumberOrNull(event.target.value)
                : Number(event.target.value || 0)
              : event.target.value,
          )
        }
        multiline={field.kind === 'textarea'}
        minRows={field.kind === 'textarea' ? field.minRows ?? 4 : undefined}
        disabled={field.readOnly}
        fullWidth
      />
    );
  };

  const renderTranslatedFields = (language: AdminLanguageCode) => (
    <Stack spacing={3}>
      {(config.translatedFields ?? []).map((field) => {
        const fieldName = `${field.baseName}${languageFieldSuffix[language]}`;

        if (field.kind === 'richText') {
          return (
            <Stack key={fieldName} spacing={1}>
              <Typography variant="subtitle2">{t(field.labelKey)}</Typography>
              <AdminRichTextEditor
                value={form[fieldName] ?? ''}
                onChange={(value) => setField(fieldName, value)}
                minHeight={field.minHeight ?? 220}
                compact
                enableMathJax
                mathJaxPromptText={t('admin.form.prompts.mathJax')}
              />
            </Stack>
          );
        }

        return (
          <TextField
            key={fieldName}
            label={t(field.labelKey, { language: t(`admin.form.languages.${language}`) })}
            value={form[fieldName] ?? ''}
            onChange={(event) => setField(fieldName, event.target.value)}
            fullWidth
          />
        );
      })}
    </Stack>
  );

  const sidebarFields = config.fields.filter((field) => (field.section ?? 'main') === 'sidebar');
  const mainFields = config.fields.filter((field) => (field.section ?? 'main') === 'main');
  const pageTitle = isEdit
    ? formatAdminEditTitle(id, getAdminResourceTitle(form) || getAdminResourceTitle(data))
    : t(config.createTitleKey);

  if (isEdit && isLoading && !data) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <AdminFormPageLayout
      title={pageTitle}
      listPath={config.listPath}
      isEdit={isEdit}
      isSaving={isSaving}
      onSave={handleSave}
      onDelete={handleDelete}
      sidebarTitle={t(config.sidebarTitleKey)}
      sidebar={<Stack spacing={2.5}>{sidebarFields.map(renderField)}</Stack>}
    >
      {error ? <Alert severity="error">{error}</Alert> : null}

      {config.translatedFields?.length ? (
        <AdminFormSection
          title={t(config.translatedSectionTitleKey ?? 'admin.form.sections.translations')}
          subheader={
            config.translatedSectionSubheaderKey
              ? t(config.translatedSectionSubheaderKey)
              : undefined
          }
        >
          <AdminLanguageTabs>{renderTranslatedFields}</AdminLanguageTabs>
        </AdminFormSection>
      ) : null}

      {mainFields.length ? (
        <AdminFormSection title={t('admin.form.sections.details')}>
          {mainFields.map(renderField)}
        </AdminFormSection>
      ) : null}
    </AdminFormPageLayout>
  );
};

export { AdminSimpleResourceFormPage, AdminSimpleResourceListPage };
export type { AdminSimpleResourceConfig };
