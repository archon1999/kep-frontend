import { MouseEvent, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const NotificationActionMenu = () => {
  const { t } = useTranslation();
  const id = useId();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id={`${id}-trigger`}
        aria-label={t('notifications.actions')}
        aria-haspopup="menu"
        aria-controls={open ? id : undefined}
        aria-expanded={open ? true : undefined}
        shape="square"
        color="neutral"
        variant="text"
        onClick={handleClick}
      >
        <IconifyIcon icon="material-symbols:more-horiz" />
      </Button>
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': `${id}-trigger`,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
          {t('notifications.remove')}
        </MenuItem>
        <MenuItem onClick={handleClose}>{t('notifications.reportIssue')}</MenuItem>
      </Menu>
    </div>
  );
};

export default NotificationActionMenu;
