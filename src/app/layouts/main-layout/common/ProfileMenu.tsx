import { PropsWithChildren, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Divider,
  Link,
  ListItemIcon,
  MenuItem,
  MenuItemProps,
  Stack,
  SxProps,
  Typography,
  listClasses,
  listItemIconClasses,
  paperClasses,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import { demoUser, useAuth } from 'app/providers/AuthProvider';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { authPaths } from 'app/routes/route-config';
import { getResourceByUsername, resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import StatusAvatar from 'shared/components/base/StatusAvatar';

interface ProfileMenuProps {
  type?: 'default' | 'slim';
}

interface ProfileMenuItemProps extends MenuItemProps {
  icon: string;
  href?: string;
  sx?: SxProps;
}

const ProfileMenu = ({ type = 'default' }: ProfileMenuProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { up } = useBreakpoints();
  const upSm = up('sm');
  const { currentUser, signout } = useAuth();

  // Demo user data used for development purposes
  const user = useMemo(() => currentUser || demoUser, [currentUser]);
  const username = useMemo(() => user?.username || user?.name || user?.email || 'User', [user]);
  const combinedName = useMemo(
    () => [user?.firstName, user?.lastName].filter(Boolean).join(' '),
    [user],
  );
  const profileHref = useMemo(
    () =>
      currentUser
        ? getResourceByUsername(resources.UserProfile, user.username)
        : authPaths.login,
    [currentUser, user.username],
  );

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = async () => {
    await signout();
    navigate(authPaths.login);
    handleClose();
  };

  const menuButton = (
    <Button
      color="neutral"
      variant="text"
      onClick={handleClick}
      sx={[
        {
          height: 44,
          px: 1,
          minWidth: 0,
        },
        type === 'slim' && {
          height: 30,
          minHeight: 30,
          px: 0.5,
        },
      ]}
    >
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flex: 1 }}>
        <StatusAvatar
          alt={username}
          status="online"
          src={user.avatar ?? undefined}
          sx={[
            {
              width: 40,
              height: 40,
              border: 2,
              borderColor: 'background.paper',
            },
            type === 'slim' && {
              width: 26,
              height: 26,
              border: 1,
              borderColor: 'background.paper',
            },
          ]}
        />
        {(type !== 'slim' && upSm) && (
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {username}
          </Typography>
        )}
      </Stack>
    </Button>
  );
  return (
    <>
      {menuButton}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        sx={{
          [`& .${paperClasses.root}`]: { minWidth: 320 },
          [`& .${listClasses.root}`]: { py: 0 },
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            gap: 2,
            px: 3,
            py: 2,
          }}
        >
          <StatusAvatar
            status="online"
            alt={username}
            src={user.avatar ?? undefined}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {username}
            </Typography>
            {combinedName && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {combinedName}
              </Typography>
            )}
          </Box>
        </Stack>
        <Divider />
        <Box sx={{ py: 1 }}>
          <ProfileMenuItem href={profileHref} icon="solar:user-circle-bold" onClick={handleClose}>
            Profile
          </ProfileMenuItem>
          <ProfileMenuItem href={resources.Settings} icon="solar:settings-linear" onClick={handleClose}>
            Settings
          </ProfileMenuItem>
        </Box>
        <Divider />
        <Box sx={{ py: 1 }}>
          {currentUser ? (
            <ProfileMenuItem onClick={handleSignout} icon="material-symbols:logout-rounded">
              Logout
            </ProfileMenuItem>
          ) : (
            <ProfileMenuItem href={authPaths.login} icon="material-symbols:login-rounded">
              Sign In
            </ProfileMenuItem>
          )}
        </Box>
      </Menu>
    </>
  );
};

const ProfileMenuItem = ({
  icon,
  onClick,
  children,
  href,
  sx,
}: PropsWithChildren<ProfileMenuItemProps>) => {
  const linkProps = href ? { component: Link, href, underline: 'none' } : {};
  return (
    <MenuItem onClick={onClick} {...linkProps} sx={{ gap: 1, ...sx }}>
      <ListItemIcon
        sx={{
          [`&.${listItemIconClasses.root}`]: { minWidth: 'unset !important' },
        }}
      >
        <IconifyIcon icon={icon} sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      {children}
    </MenuItem>
  );
};

export default ProfileMenu;
