import type { AdminDetail } from '../entities/console.types';

/** Refresh translated metadata without accepting a newer version of the edited record. */
export const localizeAdminRecord = (snapshot: AdminDetail, metadata: AdminDetail): AdminDetail => {
  if (snapshot.id !== metadata.id) return snapshot;
  return {
    ...snapshot,
    fields: metadata.fields,
    sections: metadata.sections,
    actions: metadata.actions,
    canSave: snapshot.canSave && metadata.canSave,
    permissions: metadata.permissions,
    inlines: snapshot.inlines.map((section) => {
      const localized = metadata.inlines.find((item) => item.prefix === section.prefix);
      return localized
        ? {
            ...section,
            name: localized.name,
            fields: localized.fields,
            permissions: localized.permissions,
          }
        : section;
    }),
  };
};
