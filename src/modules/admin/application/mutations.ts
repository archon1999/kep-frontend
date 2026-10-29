import { adminRepository } from 'modules/admin/data-access';

export const saveAdminRecord = adminRepository.save;
export const previewAdminAction = adminRepository.preview;
export const executeAdminAction = adminRepository.execute;
export const lookupAdminRelation = adminRepository.lookup;
export const loadAdminInline = adminRepository.inline;
export const importAdminOrder = adminRepository.importOrder;
export const changeAdminPassword = adminRepository.changePassword;
