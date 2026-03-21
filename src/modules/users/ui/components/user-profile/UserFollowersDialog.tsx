import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useUserFollowers } from '../../../application/queries';
import UserPopover from '../UserPopover';

const DIALOG_PAGE_SIZE = 10;
const SKELETON_ROWS = 5;

type UserFollowersDialogProps = {
  open: boolean;
  onClose: () => void;
  username: string;
};

const UserFollowersDialog = ({ open, onClose, username }: UserFollowersDialogProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [open, username]);

  const { data, isLoading, isValidating } = useUserFollowers(open ? username : null, {
    page,
    pageSize: DIALOG_PAGE_SIZE,
  });

  const followers = data?.data ?? [];
  const total = data?.total ?? 0;
  const pagesCount = data?.pagesCount ?? 1;
  const isInitialLoading = (isLoading || isValidating) && !followers.length;
  const showPagination = pagesCount > 1;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" fontWeight={700}>
              {t('users.profile.followers.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {total}
            </Typography>
          </Stack>

          <IconButton aria-label={t('users.profile.followers.title')} onClick={onClose}>
            <IconifyIcon icon="mdi:close" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5, pb: 3 }}>
        {isInitialLoading ? (
          <List disablePadding>
            {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <ListItem key={index} disableGutters sx={{ py: 1 }}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="35%" />}
                  secondary={<Skeleton variant="text" width="55%" />}
                />
              </ListItem>
            ))}
          </List>
        ) : followers.length ? (
          <List disablePadding>
            {followers.map((follower) => {
              const fullName = [follower.firstName, follower.lastName].filter(Boolean).join(' ');
              const countryCode = follower.country?.toUpperCase();

              return (
                <ListItem key={follower.username} disableGutters sx={{ py: 1 }}>
                  <UserPopover
                    username={follower.username}
                    avatar={follower.avatar}
                    fullName={fullName}
                    countryCode={countryCode}
                    streak={follower.streak}
                    sx={{ width: '100%' }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                      <ListItemAvatar>
                        <Avatar src={follower.avatar} alt={follower.username} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={follower.username}
                        secondary={fullName || undefined}
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondaryTypographyProps={{ noWrap: true }}
                      />
                    </Stack>
                  </UserPopover>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('users.profile.followers.empty', { defaultValue: 'No followers yet.' })}
          </Typography>
        )}

        {showPagination ? (
          <Stack alignItems="center" sx={{ pt: 2.5 }}>
            <Pagination
              count={pagesCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              disabled={isLoading || isValidating}
            />
          </Stack>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default UserFollowersDialog;
