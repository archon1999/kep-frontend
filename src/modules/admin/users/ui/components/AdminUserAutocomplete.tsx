import { TextFieldProps } from '@mui/material';
import { UsersAutocomplete } from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import { AdminUser } from '../../domain/types';

interface AdminUserAutocompleteProps {
  value: AdminUser | null;
  onChange: (value: AdminUser | null) => void;
  label: string;
  placeholder?: string;
  textFieldProps?: TextFieldProps;
}

const AdminUserAutocomplete = (props: AdminUserAutocompleteProps) => (
  <UsersAutocomplete<AdminUser> {...props} />
);

export default AdminUserAutocomplete;
