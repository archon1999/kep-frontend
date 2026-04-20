import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useUserFollowers } from 'modules/users/application/queries';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import UserFollowersDialog from './UserFollowersDialog';

type UserFollowersCardProps = {
  username: string;
};

const PREVIEW_PAGE_SIZE = 5;

const UserFollowersCard = ({ username }: UserFollowersCardProps) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isLoading } = useUserFollowers(username, { page: 1, pageSize: PREVIEW_PAGE_SIZE });

  if (isLoading) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Skeleton variant="text" width="40%" />
          {Array.from({ length: 3 }).map((_, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width="70%" />
            </Stack>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data?.data?.length) {
    return null;
  }

  const followers = data.data;
  const total = data.total ?? followers.length;

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                {t('users.profile.followers.title')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {total}
              </Typography>
            </Stack>
            <Button
              size="small"
              variant="text"
              sx={{ px: 0.5 }}
              onClick={() => setIsDialogOpen(true)}
            >
              {t('users.profile.followers.viewAll')}
            </Button>
          </Stack>

          <List dense sx={{ mt: 1 }}>
            {followers.map((follower) => {
              const fullName = [follower.firstName, follower.lastName].filter(Boolean).join(' ');
              const countryCode = follower.country?.toUpperCase();

              return (
                <ListItem key={follower.username} disableGutters>
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
                      />
                    </Stack>
                  </UserPopover>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>

      <UserFollowersDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        username={username}
      />
    </>
  );
};

export default UserFollowersCard;
