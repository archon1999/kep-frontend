import { Button, Stack } from '@mui/material';
import { Link } from 'react-router';

interface AdminRowActionsProps {
  editPath: string;
  onDelete: () => void;
}

const AdminRowActions = ({ editPath, onDelete }: AdminRowActionsProps) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Button component={Link} to={editPath} size="small" variant="soft" color="primary">
      Edit
    </Button>
    <Button size="small" variant="soft" color="error" onClick={onDelete}>
      Delete
    </Button>
  </Stack>
);

export default AdminRowActions;
