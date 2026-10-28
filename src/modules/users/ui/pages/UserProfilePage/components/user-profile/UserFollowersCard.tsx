import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
} from '@mui/material';
import { contentInsetSx } from 'app/theme/styles/content';
import { useUserFollowers } from 'modules/users/application/queries';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
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
      <Box>
        <Box>
          <Skeleton variant="text" width="40%" />
          {Array.from({ length: 3 }).map((_, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width="70%" />
            </Stack>
          ))}
        </Box>
      </Box>
    );
  }

  if (!data?.data?.length) {
    return null;
  }

  const followers = data.data;
  const total = data.total ?? followers.length;

  return (
    <>
      <Box>
        <Box>
          <SectionHeader
            title={`${t('users.profile.followers.title')} · ${total}`}
            action={
              <Button size="small" onClick={() => setIsDialogOpen(true)}>
                {t('users.profile.followers.viewAll')}
              </Button>
            }
          />
          <List dense sx={{ ...contentInsetSx, py: 1 }}>
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
        </Box>
      </Box>

      <UserFollowersDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        username={username}
      />
    </>
  );
};

export default UserFollowersCard;
