import type { UserActivityStatistics } from 'shared/types/userActivity';

export type AdminValues = Record<string, unknown>;
export interface AdminPermissions {
  view: boolean;
  add: boolean;
  change: boolean;
  delete: boolean;
}
export interface AdminResource {
  key: string;
  app: string;
  model: string;
  name: string;
  singular: string;
  group: string;
  icon: string;
  path: string;
  editorPath: string;
  permissions: AdminPermissions;
}
export interface AdminOption {
  value: string | number;
  label: string;
}
export interface AdminField {
  format?: 'quill';
  name: string;
  label: string;
  kind: string;
  required: boolean;
  readOnly: boolean;
  help: string;
  choices?: AdminOption[];
  resource?: string;
  maxLength?: number;
  min?: number;
  max?: number;
}
export interface AdminCell {
  value: unknown;
  display: string;
  kind: string;
  resource?: string;
  url?: string;
}
export interface AdminRow {
  id: string;
  label: string;
  cells: Record<string, AdminCell>;
}
export interface AdminAction {
  name: string;
  label: string;
  dangerous: boolean;
  kind: string;
}
export interface AdminList {
  resource: AdminResource;
  columns: { name: string; label: string; sortable: boolean }[];
  filters: {
    name: string;
    label: string;
    kind: string;
    choices: AdminOption[];
    resource?: string;
  }[];
  actions: AdminAction[];
  rows: AdminRow[];
  total: number;
  page: number;
  pageSize: number;
  pagesCount: number;
}
export interface AdminInlineRow {
  label?: string;
  id: string | null;
  values: AdminValues;
  selectedOptions?: Record<string, AdminOption[]>;
  readonly?: Record<string, AdminCell>;
  delete?: boolean;
  clientId?: string;
}
export interface AdminInline {
  path?: string | null;
  prefix: string;
  key: string;
  name: string;
  fields: AdminField[];
  readonlyFields: string[];
  rows: AdminInlineRow[];
  total: number;
  page: number;
  pagesCount: number;
  defaultValues: AdminValues;
  defaultSelectedOptions: Record<string, AdminOption[]>;
  permissions: Pick<AdminPermissions, 'add' | 'change' | 'delete'>;
}
export interface AdminDetail {
  actions: AdminAction[];
  checks: { key: string; passed: boolean }[];
  publicPath: string | null;
  id: string | null;
  label: string;
  revision: string | null;
  canSave: boolean;
  fields: AdminField[];
  sections: { title: string; fields: string[] }[];
  values: AdminValues;
  selectedOptions: Record<string, AdminOption[]>;
  readonly: Record<string, AdminCell>;
  inlines: AdminInline[];
  permissions: AdminPermissions;
}
export interface AdminSave {
  revision?: string | null;
  values: AdminValues;
  inlines?: Record<string, AdminInlineRow[]>;
  files?: Record<string, unknown>;
}
export interface AdminActionPreview {
  token: string;
  action: AdminAction;
  count: number;
  impact: { name: string; count: number }[];
  records: { id: string; label: string }[];
  expiresIn: number;
}
export interface AdminAuditEntry {
  id: number;
  actor: string;
  at: string;
  object: string;
  action: number;
  message: string;
  resource: string | null;
}
export interface AdminDashboard {
  metrics: { key: string; value: number; icon: string; path: string }[];
  queues: {
    key: string;
    count: number;
    icon: string;
    path: string;
    resource: string;
    records: { id: string; label: string }[];
  }[];
  upcoming: { id: string; label: string; resource: string; at: string; path: string }[];
  activity: { date: string; value: number }[];
  userActivity: UserActivityStatistics | null;
  audit: AdminAuditEntry[];
  resourceCount: number;
  generatedAt: string;
}
export interface AdminListQuery {
  queue?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
  filters?: Record<string, unknown>;
}
export interface AdminLookup {
  filter?: boolean;
  id?: string;
  inline?: string;
  field: string;
  search?: string;
  page?: number;
  values?: AdminValues;
}
export interface AdminWorkflowForm {
  fields: AdminField[];
  values: AdminValues;
  selectedOptions: Record<string, AdminOption[]>;
}
