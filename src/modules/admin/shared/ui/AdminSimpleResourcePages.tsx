import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
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
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getResourceById } from 'app/routes/resources';
import type { AdminResourceOperationsConfig } from 'modules/admin/shared/application/admin-resource-config';
import type {
  AdminAutocompleteFieldKind,
  AdminFilterConfig,
  AdminFormFieldConfig,
  AdminSimpleRow,
} from 'modules/admin/shared/application/admin-resource-config';
import {
  autocompleteFieldKinds,
  isAutocompleteFieldKind,
} from 'modules/admin/shared/application/admin-resource-fields';
import { useAdminResourceFormPage } from 'modules/admin/shared/application/hooks/useAdminResourceFormPage';
import { useAdminResourceListPage } from 'modules/admin/shared/application/hooks/useAdminResourceListPage';
import type { AdminAutocompleteOption } from 'modules/admin/shared/domain/autocomplete.types';
import type { AdminLanguageCode } from 'modules/admin/shared/domain/language.types';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import DataGridNoRowsOverlay, {
  getDataGridNoRowsOverlaySlotProps,
  hasDataGridActiveFilters,
} from 'shared/components/common/DataGridNoRowsOverlay';
import FilterDrawer, {
  DEFAULT_FILTER_DRAWER_WIDTH,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import AttemptVerdict from 'shared/components/problems/AttemptVerdict';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import { useConfirmationDialog } from 'shared/hooks/useConfirmationDialog';
import useStableGridRowCount from 'shared/hooks/useStableGridRowCount';
import { formatDateTimePickerValue, parseDateTimePickerValue } from 'shared/lib/dateTime';
import { AdminChoiceOption } from '../domain/types.ts';
import { formatAdminEditTitle, getAdminResourceTitle } from '../utils/editTitle';
import { toNumberOrNull } from '../utils/formUtils';
import AdminBatchActionsToolbar from './AdminBatchActionsToolbar';
import { AdminChoiceSelect, LanguageSelect, VerdictSelect } from './AdminChoiceSelects';
import AdminDataGridSkeletonLoadingOverlay from './AdminDataGridSkeletonLoadingOverlay';
import AdminDateTimeDisplay from './AdminDateTimeDisplay';
import AdminFiltersToolbar, { AdminActiveFilter } from './AdminFiltersToolbar';
import AdminFormPageLayout from './AdminFormPageLayout';
import AdminFormSection from './AdminFormSection';
import AdminLanguageTabs from './AdminLanguageTabs';
import AdminListPageLayout from './AdminListPageLayout';
import {
  ContestsAutocomplete,
  ProblemsAutocomplete,
  TeamsAutocomplete,
  UsersAutocomplete,
} from './AdminResourceAutocomplete';
import AdminRichTextEditor from './AdminRichTextEditor';
import AdminRowActions, { AdminRowActionItem } from './AdminRowActions';
import TextField from './AdminTextField';

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

interface AdminSimpleResourceConfig extends AdminResourceOperationsConfig {
  createPath: string;
  editPath: string;
  titleKey: string;
  createButtonKey?: string;
  editTitleKey: string;
  searchPlaceholderKey: string;
  selectedLabelKey: string;
  sidebarTitleKey: string;
  columns: AdminListColumnConfig[];
  translatedSectionTitleKey?: string;
  translatedSectionSubheaderKey?: string;
  batchActions?: AdminBatchActionConfig[];
  rowActions?: (
    row: AdminSimpleRow,
    helpers: {
      t: ReturnType<typeof useTranslation>['t'];
      runBatchAction: (
        ids: Array<number | string>,
        action: AdminBatchActionConfig,
      ) => Promise<void>;
    },
  ) => AdminRowActionItem[];
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

const getAutocompleteOptionLabel = (value: AdminAutocompleteOption) =>
  value.username ?? value.title ?? value.name ?? value.code ?? `#${value.id}`;

const getChoiceOptions = (
  meta: Record<string, AdminChoiceOption[]> | undefined,
  choicesKey?: string,
) => (choicesKey ? (meta?.[choicesKey] ?? []) : []);

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

const AdminSimpleResourceListPage = ({ config }: AdminSimpleResourcePageProps) => {
  const { confirm, confirmationDialog } = useConfirmationDialog();
  const { t } = useTranslation();
  const {
    search,
    setSearch,
    filters,
    setFilters,
    rowSelectionModel,
    setRowSelectionModel,
    isBatching,
    sortModel,
    setSortModel,
    paginationModel,
    onPaginationModelChange,
    meta,
    data,
    isLoading,
    isValidating,
    selectedIds,
    resetRowSelection,
    runBatchAction,
    handleDelete,
  } = useAdminResourceListPage(config, confirm);
  const filterDrawer = useFilterDrawer();

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
      const unitKey =
        column.type === 'attemptTime' ? 'problems.attempts.ms' : 'problems.attempts.kb';

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

    return <UsersAutocomplete {...props} placeholder={t('admin.form.placeholders.username')} />;
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
          getChoiceOptions(meta, filter.choicesKey).find((option) => option.value === value)
            ?.label ?? String(value);
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
    <Stack direction="column" spacing={2.5}>
      {config.filters.map(renderFilter)}
    </Stack>
  ) : null;
  const filtersId = `admin-${config.resource.replace(/[^a-z0-9]+/gi, '-')}`;

  const isGridLoading = isLoading || (isValidating && !data);
  const rowCount = useStableGridRowCount(data?.total, isGridLoading);

  return (
    <>
      {confirmationDialog}
      {
        <AdminListPageLayout
          title={t(config.titleKey)}
          createPath={config.createPath}
          createLabel={config.createButtonKey ? t(config.createButtonKey) : undefined}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={t(config.searchPlaceholderKey)}
          filterDrawerOpen={filterDrawer.open}
          filterAnchorEl={filterDrawer.anchorEl}
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
                onSearchChange={setSearch}
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
              filtered: hasDataGridActiveFilters({ search, ...filters }),
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
      }
    </>
  );
};

const AdminSimpleResourceFormPage = ({ config }: AdminSimpleResourcePageProps) => {
  const { confirm, confirmationDialog } = useConfirmationDialog();
  const { t } = useTranslation();
  const {
    id,
    isEdit,
    form,
    setField,
    selectedAutocompleteOptions,
    setSelectedAutocompleteOptions,
    isSaving,
    error,
    data,
    isLoading,
    meta,
    handleSave,
    handleDelete,
  } = useAdminResourceFormPage(config, confirm);

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
        placeholder:
          field.kind === 'user'
            ? t('admin.form.placeholders.username')
            : t('admin.searchPlaceholder'),
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
          onChange={(value) => setField(field.name, formatDateTimePickerValue(value))}
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
        minRows={field.kind === 'textarea' ? (field.minRows ?? 4) : undefined}
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
    <>
      {confirmationDialog}
      {
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
      }
    </>
  );
};

export { AdminSimpleResourceFormPage, AdminSimpleResourceListPage };
export type { AdminSimpleResourceConfig };
