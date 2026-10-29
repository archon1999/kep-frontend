import type { AdminRepository, AdminResource, AdminSave } from 'modules/admin/domain';
import { adminRequest as axiosMutator } from '../client/adminRequest';

const base = '/api/admin/console/';
const endpoint = (key: string) =>
  `${base}resources/${key.split('.').map(encodeURIComponent).join('/')}/`;
const body = (command: AdminSave) => {
  const { files = {}, ...payload } = command;
  if (payload.inlines)
    payload.inlines = Object.fromEntries(
      Object.entries(payload.inlines).map(([prefix, rows]) => [
        prefix,
        [...rows.filter((row) => row.id), ...rows.filter((row) => !row.id && !row.delete)],
      ]),
    );
  const uploads = Object.entries(files).filter(
    (entry): entry is [string, File] => entry[1] instanceof File,
  );
  if (!uploads.length) return payload;
  const data = new FormData();
  data.append('payload', JSON.stringify(payload));
  uploads.forEach(([name, file]) => {
    const [prefix, identifier, field] = name.split('.');
    const index = payload.inlines?.[prefix]?.findIndex(
      (row) => (row.id ?? row.clientId) === identifier,
    );
    const target =
      field && index !== undefined && index >= 0 ? `${prefix}.${index}.${field}` : name;
    data.append(target, file);
  });
  return data;
};

export const adminRepository: AdminRepository = {
  changePassword: (id, password, confirmation) =>
    axiosMutator({
      url: `${base}users/${encodeURIComponent(id)}/password/`,
      method: 'POST',
      data: { password, confirmation },
    }),
  registry: async () =>
    (await axiosMutator<{ resources: AdminResource[] }>({ url: base + 'registry/' })).resources,
  dashboard: () => axiosMutator({ url: base + 'dashboard/' }),
  list: (key, query) =>
    axiosMutator({
      url: endpoint(key),
      params: { ...query, filters: JSON.stringify(query.filters ?? {}) },
    }),
  detail: (key, id) =>
    axiosMutator({ url: endpoint(key) + (id ? `${encodeURIComponent(id)}/` : 'schema/') }),
  save: (key, id, command) =>
    axiosMutator({
      url: endpoint(key) + (id ? `${encodeURIComponent(id)}/` : ''),
      method: id ? 'PATCH' : 'POST',
      data: body(command),
    }),
  lookup: (key, query) =>
    axiosMutator({ url: endpoint(key) + 'options/', method: 'POST', data: query }),
  inline: async (key, id, prefix, page) =>
    (
      await axiosMutator<{ inlines: Awaited<ReturnType<AdminRepository['inline']>> }>({
        url: endpoint(key) + `${encodeURIComponent(id)}/inlines/${encodeURIComponent(prefix)}/`,
        params: { page },
      })
    ).inlines,
  history: async (key, id) =>
    (
      await axiosMutator<{ entries: Awaited<ReturnType<AdminRepository['history']>> }>({
        url: endpoint(key) + `${encodeURIComponent(id)}/history/`,
      })
    ).entries,
  preview: (key, action, ids) =>
    axiosMutator({
      url: endpoint(key) + 'actions/preview/',
      method: 'POST',
      data: { action, ids },
    }),
  execute: (key, token) =>
    axiosMutator({
      url: endpoint(key) + 'actions/execute/',
      method: 'POST',
      data: { token, confirmed: true },
    }),
  workflow: () => axiosMutator({ url: base + 'workflows/legacy-order/' }),
  importOrder: (command) =>
    axiosMutator({ url: base + 'workflows/legacy-order/', method: 'POST', data: body(command) }),
};
