import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { IconButton, Tooltip } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useSetUserFollowing } from 'modules/users/application/mutations';
import KepIcon from 'shared/components/base/KepIcon';
import { toast } from 'sonner';

const ProfileFollowButton = ({
  username,
  isFollowing = false,
}: {
  username: string;
  isFollowing?: boolean;
}) => {
  const { t } = useTranslation();
  const { currentUser, isAuthLoading } = useAuth();
  const { trigger, isMutating } = useSetUserFollowing(username);
  if (currentUser?.username === username || isAuthLoading) return null;
  const label = t(
    isFollowing ? 'users.profile.actions.unfollowTooltip' : 'users.profile.actions.followTooltip',
  );
  const icon = <KepIcon name={isFollowing ? 'star' : 'star-outline'} fontSize={25} />;
  const sx = {
    flexShrink: 0,
    bgcolor: 'transparent',
    color: isFollowing ? 'warning.main' : 'text.secondary',
  };
  if (!currentUser)
    return (
      <Tooltip title={label}>
        <IconButton
          component={RouterLink}
          aria-label={label}
          to={`${resources.Login}?${new URLSearchParams({ returnUrl: getResourceByUsername(resources.UserProfile, username) })}`}
          sx={sx}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          aria-label={label}
          aria-pressed={isFollowing}
          disabled={isMutating}
          sx={sx}
          onClick={async () => {
            try {
              await trigger(!isFollowing);
            } catch {
              toast.error(t('settings.error'));
            }
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ProfileFollowButton;
