/** Transport-independent list sorting and selection, structurally compatible with grid adapters. */
export type SortModel = readonly { field: string; sort: 'asc' | 'desc' | null | undefined }[];
export type RowSelection = { type: 'include' | 'exclude'; ids: Set<string | number> };
