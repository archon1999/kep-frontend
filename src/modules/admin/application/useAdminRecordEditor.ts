import { useState } from 'react';
import type { AdminDetail, AdminInlineRow, AdminValues } from 'modules/admin/domain';
import { localizeAdminRecord } from 'modules/admin/domain/utils/recordDraft';
import { saveAdminRecord } from './mutations';

export const useAdminRecordEditor = (resourceKey: string, initial: AdminDetail) => {
  const [record, setRecord] = useState(initial);
  const [values, setValues] = useState(initial.values);
  const [files, setFiles] = useState<Record<string, unknown>>({});
  const [inlines, setInlines] = useState<Record<string, Record<string, AdminInlineRow>>>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const setField = (name: string, value: unknown) => {
    setValues((current) => ({ ...current, [name]: value }));
    setDirty(true);
  };
  const setFile = (name: string, value: unknown) => {
    setFiles((current) => ({ ...current, [name]: value }));
    setDirty(true);
  };
  const setInline = (prefix: string, row: AdminInlineRow) => {
    const id = row.id ?? row.clientId!;
    setInlines((current) => ({ ...current, [prefix]: { ...current[prefix], [id]: row } }));
    setDirty(true);
  };
  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payloadValues: AdminValues = Object.fromEntries(
        Object.entries(values).filter(
          ([name, value]) =>
            !(record.fields.find((field) => field.name === name)?.kind === 'secret' && !value),
        ),
      );
      const result = await saveAdminRecord(resourceKey, record.id ?? undefined, {
        revision: record.revision,
        values: payloadValues,
        files,
        inlines: Object.fromEntries(
          Object.entries(inlines).map(([prefix, rows]) => [prefix, Object.values(rows)]),
        ),
      });
      setRecord(result);
      setValues(result.values);
      setFiles({});
      setInlines({});
      setDirty(false);
      return result;
    } catch (failure) {
      setError(failure);
      return null;
    } finally {
      setSaving(false);
    }
  };
  return {
    record: localizeAdminRecord(record, initial),
    values,
    files,
    inlines,
    dirty,
    saving,
    error,
    setField,
    setFile,
    setInline,
    save,
  };
};
