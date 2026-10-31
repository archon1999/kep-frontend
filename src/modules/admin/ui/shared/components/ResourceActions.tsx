import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import type { AdminAction } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { actionTitle } from '../helpers';

export default function ResourceActions({
  actions,
  onAction,
  busy,
  editPath,
  compact = false,
  recordLabel,
}: {
  actions: AdminAction[];
  onAction: (name: string) => void;
  busy?: boolean;
  editPath?: string;
  compact?: boolean;
  recordLabel?: string;
}) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      {compact ? (
        <Tooltip title={t('admin.columns.actions')}>
          <IconButton
            aria-label={
              recordLabel
                ? t('admin.workspace.recordActions', { name: recordLabel })
                : t('admin.columns.actions')
            }
            onClick={(event) => setAnchor(event.currentTarget)}
            disabled={busy}
            size="small"
          >
            <IconifyIcon icon="mdi:dots-horizontal" />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          size="small"
          variant="outlined"
          onClick={(event) => setAnchor(event.currentTarget)}
          loading={busy}
          endIcon={<IconifyIcon icon="mdi:chevron-down" />}
        >
          {t('admin.workspace.selectedActions')}
        </Button>
      )}
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {editPath && (
          <MenuItem component={Link} to={editPath} onClick={() => setAnchor(null)}>
            <ListItemIcon>
              <IconifyIcon icon="mdi:pencil-outline" />
            </ListItemIcon>
            <ListItemText>{t('admin.workspace.openRecord')}</ListItemText>
          </MenuItem>
        )}
        {actions.flatMap((action, index) => [
          ...(action.dangerous && index > 0 ? [<Divider key={action.name + '-divider'} />] : []),
          <MenuItem
            key={action.name}
            onClick={() => {
              setAnchor(null);
              onAction(action.name);
            }}
            sx={{ color: action.dangerous ? 'error.main' : undefined }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <IconifyIcon
                icon={
                  action.dangerous
                    ? 'mdi:delete-outline'
                    : action.kind === 'export'
                      ? 'mdi:download-outline'
                      : 'mdi:flash-outline'
                }
              />
            </ListItemIcon>
            <ListItemText>
              {editPath && action.kind === 'delete'
                ? t('admin.actions.delete')
                : actionTitle(t, action.name, action.label)}
            </ListItemText>
          </MenuItem>,
        ])}
      </Menu>
    </>
  );
}
