import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonProps,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router';
import IconifyIcon from 'shared/components/base/IconifyIcon';

export interface AdminRowActionItem {
  label: string;
  icon: string;
  color?: ButtonProps['color'];
  onClick?: () => void;
  to?: string;
  disabled?: boolean;
}

interface AdminRowActionsProps {
  editPath?: string;
  onDelete?: () => void;
  actions?: AdminRowActionItem[];
  label?: string;
}

const getActionColor = (color?: ButtonProps['color']) => {
  if (!color || color === 'inherit') {
    return 'text.secondary';
  }

  if (color === 'error') {
    return 'error.main';
  }

  return `${color}.main`;
};

const AdminRowActions = ({
  editPath,
  onDelete,
  actions,
  label,
}: AdminRowActionsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const resolvedLabel = label ?? t('admin.columns.actions');

  const resolvedActions =
    actions ??
    [
      ...(editPath
        ? [
            {
              label: t('admin.actions.edit'),
              icon: 'mdi:pencil-outline',
              to: editPath,
            },
          ]
        : []),
      ...(onDelete
        ? [
            {
              label: t('admin.actions.delete'),
              icon: 'mdi:delete-outline',
              color: 'error' as const,
              onClick: onDelete,
            },
          ]
        : []),
    ];

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleActionClick = (action: AdminRowActionItem) => (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    handleClose();

    if (action.to) {
      navigate(action.to);
    }
    action.onClick?.();
  };

  return (
    <>
      <Tooltip title={resolvedLabel}>
        <IconButton size="small" onClick={handleOpen} aria-label={resolvedLabel}>
          <IconifyIcon icon="mdi:dots-vertical" width={20} height={20} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(event) => event.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {resolvedActions.map((action) => (
          <MenuItem
            key={action.label}
            disabled={action.disabled}
            onClick={handleActionClick(action)}
            sx={{
              color: action.color === 'error' ? 'error.main' : 'text.primary',
              minWidth: 180,
            }}
          >
            <ListItemIcon sx={{ color: getActionColor(action.color), minWidth: 36 }}>
              <IconifyIcon icon={action.icon} width={20} height={20} />
            </ListItemIcon>
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AdminRowActions;
