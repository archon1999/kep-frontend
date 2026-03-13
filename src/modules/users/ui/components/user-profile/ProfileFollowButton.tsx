import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { usersApiClient } from '../../../data-access/api/users.client';
import { useAuth } from 'app/providers/AuthProvider';
import KepIcon from 'shared/components/base/KepIcon';

type ProfileFollowButtonProps = {
  username: string;
  isFollowing?: boolean;
};

const ProfileFollowButton = ({ username, isFollowing: isFollowingProp }: ProfileFollowButtonProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(Boolean(isFollowingProp));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(Boolean(isFollowingProp));
  }, [isFollowingProp]);

  const canFollow = useMemo(
    () => Boolean(username) && currentUser?.username !== username,
    [currentUser?.username, username],
  );

  const handleToggle = async () => {
    if (!canFollow || loading) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await usersApiClient.unfollow(username);
        setIsFollowing(false);
      } else {
        await usersApiClient.follow(username);
        setIsFollowing(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!canFollow) {
    return null;
  }

  return (
    <Tooltip
      title={
        isFollowing ? t('users.profile.actions.unfollowTooltip') : t('users.profile.actions.followTooltip')
      }
    >
      <span>
        <IconButton size="small" color="primary" onClick={handleToggle} disabled={loading}>
          {loading ? (
            <CircularProgress size={18} />
          ) : (
            <KepIcon
              name={isFollowing ? 'star' : 'star-outline'}
              fontSize={20}
              color={isFollowing ? 'primary.main' : 'text.secondary'}
            />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ProfileFollowButton;
