import { useTranslation } from 'react-i18next';
import { Avatar, Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import UserPopover from 'modules/users/ui/components/UserPopover';
import { ProblemDetail } from '../../../domain/entities/problem.entity';

interface ProblemFooterProps {
  problem: ProblemDetail;
  onFavoriteToggle: () => void;
  onLike: () => void;
  onDislike: () => void;
}

export const ProblemFooter = ({ problem, onFavoriteToggle, onLike, onDislike }: ProblemFooterProps) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
        <UserPopover username={problem.authorUsername ?? ''}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Avatar src={problem.authorAvatar} sx={{ width: 28, height: 28 }} />
            <Typography variant="body2" fontWeight={700}>
              {problem.authorUsername ?? ''}
            </Typography>
          </Stack>
        </UserPopover>

        <Tooltip
          title={
            problem.userInfo?.isFavorite ? t('problems.detail.favorited') : t('problems.detail.favorite')
          }
        >
          <IconButton
            size="small"
            color={problem.userInfo?.isFavorite ? 'warning' : 'default'}
            onClick={onFavoriteToggle}
          >
            <IconifyIcon icon="mdi:star-outline" />
          </IconButton>
        </Tooltip>

        <Stack direction="row" spacing={1}>
          <Button
            variant={problem.userInfo?.voteType === 1 ? 'contained' : 'outlined'}
            color="success"
            size="small"
            onClick={onLike}
            startIcon={<IconifyIcon icon="mdi:thumb-up-outline" />}
          >
            {problem.likesCount ?? 0}
          </Button>
          <Button
            variant={problem.userInfo?.voteType === 0 ? 'contained' : 'outlined'}
            color="error"
            size="small"
            onClick={onDislike}
            startIcon={<IconifyIcon icon="mdi:thumb-down-outline" />}
          >
            {problem.dislikesCount ?? 0}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
