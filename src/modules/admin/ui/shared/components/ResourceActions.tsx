import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import type { AdminAction, AdminResource } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { actionTitle, editRecordTitle, rowActionTitle } from '../helpers';
import { actionIcon } from '../helpers/actionIcon';

export default function ResourceActions({
  actions,
  onAction,
  busy,
  editPath,
  compact = false,
  recordLabel,
  links = [],
  onPassword,
  onReply,
  resource,
}: {
  actions: AdminAction[];
  onAction: (name: string) => void;
  busy?: boolean;
  editPath?: string;
  compact?: boolean;
  recordLabel?: string;
  links?: { label: string; to: string; icon: string }[];
  onPassword?: () => void;
  onReply?: () => void;
  resource?: Pick<AdminResource, 'key' | 'singular'>;
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
            <ListItemText>{editRecordTitle(t, resource)}</ListItemText>
          </MenuItem>
        )}
        {onPassword && (
          <MenuItem
            onClick={() => {
              setAnchor(null);
              onPassword();
            }}
          >
            <ListItemIcon>
              <IconifyIcon icon="mdi:form-textbox-password" />
            </ListItemIcon>
            <ListItemText>{t('admin.actions.changePassword')}</ListItemText>
          </MenuItem>
        )}
        {onReply && (
          <MenuItem
            onClick={() => {
              setAnchor(null);
              onReply();
            }}
          >
            <ListItemIcon>
              <IconifyIcon icon="mdi:reply-outline" />
            </ListItemIcon>
            <ListItemText>{t('admin.workspace.reply')}</ListItemText>
          </MenuItem>
        )}
        {links.length > 0 && (
          <ListSubheader sx={{ lineHeight: '30px', fontSize: 11 }}>
            {t('admin.workspace.relatedRecords')}
          </ListSubheader>
        )}
        {links.map((link) => (
          <MenuItem key={link.to} component={Link} to={link.to} onClick={() => setAnchor(null)}>
            <ListItemIcon>
              <IconifyIcon icon={link.icon} />
            </ListItemIcon>
            <ListItemText>{link.label}</ListItemText>
          </MenuItem>
        ))}
        {(links.length > 0 || onPassword || onReply) && actions.length > 0 && <Divider />}
        {[...actions]
          .sort((a, b) => Number(a.kind === 'delete') - Number(b.kind === 'delete'))
          .flatMap((action, index) => [
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
                <IconifyIcon icon={actionIcon(action)} />
              </ListItemIcon>
              <ListItemText>
                {editPath && action.kind === 'delete'
                  ? t('admin.actions.delete')
                  : editPath
                    ? rowActionTitle(t, action.name, action.label)
                    : actionTitle(t, action.name, action.label)}
              </ListItemText>
            </MenuItem>,
          ])}
      </Menu>
    </>
  );
}
