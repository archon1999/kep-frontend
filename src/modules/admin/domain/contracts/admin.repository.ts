import type {
  AdminActionPreview,
  AdminAuditEntry,
  AdminDashboard,
  AdminDetail,
  AdminInline,
  AdminList,
  AdminListQuery,
  AdminLookup,
  AdminOption,
  AdminResource,
  AdminSave,
  AdminWorkflowForm,
} from '../entities';

export interface AdminRepository {
  changePassword(id: string, password: string, confirmation: string): Promise<{ changed: boolean }>;
  registry(): Promise<AdminResource[]>;
  dashboard(): Promise<AdminDashboard>;
  list(key: string, query: AdminListQuery): Promise<AdminList>;
  detail(key: string, id?: string): Promise<AdminDetail>;
  save(key: string, id: string | undefined, command: AdminSave): Promise<AdminDetail>;
  lookup(
    key: string,
    query: AdminLookup,
  ): Promise<{ options: AdminOption[]; hasMore: boolean; page: number }>;
  inline(key: string, id: string, prefix: string, page: number): Promise<AdminInline[]>;
  history(key: string, id: string): Promise<AdminAuditEntry[]>;
  preview(key: string, action: string, ids: string[]): Promise<AdminActionPreview>;
  execute(
    key: string,
    token: string,
  ): Promise<{ count: number; action: string; messages: string[] }>;
  workflow(): Promise<AdminWorkflowForm>;
  importOrder(command: AdminSave): Promise<AdminDetail>;
}
