import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { validationMessage } from 'modules/admin/domain/utils/validation';
import type {
  AdminResourceOperationsConfig,
  AdminSimpleRow,
  ConfirmAdminAction,
} from 'modules/admin/shared/application/admin-resource-config';
import {
  buildAutocompleteOption,
  getDefaultLabelField,
  isAutocompleteFieldKind,
  toPayloadFieldValue,
} from 'modules/admin/shared/application/admin-resource-fields';
import {
  createAdminResource,
  removeAdminResource,
  updateAdminResource,
} from 'modules/admin/shared/application/mutations';
import {
  useAdminResourceDetail,
  useAdminResourceMeta,
} from 'modules/admin/shared/application/queries';
import type { AdminAutocompleteOption } from 'modules/admin/shared/domain/autocomplete.types';
import { AdminChoiceOption } from 'modules/admin/shared/domain/types.ts';
import { formatDateTimeLocalInputValue } from 'shared/lib/dateTime';

export const useAdminResourceFormPage = (
  config: AdminResourceOperationsConfig,
  confirm: ConfirmAdminAction,
) => {
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

  const { data, isLoading } = useAdminResourceDetail<AdminSimpleRow>(config.resource, id);

  const { data: meta } = useAdminResourceMeta<Record<string, AdminChoiceOption[]>>(
    config.resource,
    config.metaResource,
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
      if (
        field.omitWhenEmpty &&
        (form[field.name] === '' || form[field.name] === null || form[field.name] === undefined)
      ) {
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
        await updateAdminResource(config.resource, id, payload);
      } else {
        await createAdminResource(config.resource, payload);
      }
      navigate(config.listPath);
    } catch (caughtError: any) {
      setError(validationMessage(caughtError) || t('admin.console.loadError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !(await confirm(t(config.confirmDeleteKey, { id })))) {
      return;
    }

    await removeAdminResource(config.resource, id);
    navigate(config.listPath);
  };

  return {
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
  };
};
