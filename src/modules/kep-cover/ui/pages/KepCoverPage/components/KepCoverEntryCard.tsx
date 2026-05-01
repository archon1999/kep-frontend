import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { getResourceByUsername, resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { cssVarRgba } from 'shared/lib/utils';
import type { KepCoverEntry } from 'modules/kep-cover/domain/entities/kep-cover.entity';

interface KepCoverEntryCardProps {
  entry: KepCoverEntry;
  rank?: number;
  isVotingOpen: boolean;
  canVote: boolean;
  isVoting: boolean;
  onVote?: (entryId: number) => Promise<void> | void;
  loginRequired?: boolean;
}

const KepCoverEntryCard = ({
  entry,
  rank,
  isVotingOpen,
  canVote,
  isVoting,
  onVote,
  loginRequired = false,
}: KepCoverEntryCardProps) => {
  const { t } = useTranslation();
  const fullName = [entry.user.firstName, entry.user.lastName].filter(Boolean).join(' ');

  return (
    <Paper
      sx={(theme) => ({
        overflow: 'hidden',
        borderRadius: 4,
        background: `linear-gradient(180deg, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.04)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.01)})`,
      })}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '16 / 9',
          backgroundImage: `url(${entry.coverPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0.74) 100%)',
          }}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ position: 'absolute', inset: 0, p: 2 }}
        >
          {typeof rank === 'number' ? (
            <Chip label={`#${rank}`} color={rank <= 3 ? 'warning' : 'default'} variant="filled" />
          ) : (
            <span />
          )}

          <Chip
            icon={<IconifyIcon icon="mdi:heart" />}
            label={entry.likesCount}
            color={entry.isLiked ? 'error' : 'default'}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ position: 'absolute', left: 16, right: 16, bottom: 16, color: 'common.white' }}
        >
          <Avatar src={entry.user.avatar} alt={entry.user.username} sx={{ width: 44, height: 44 }} />

          <Stack minWidth={0} flex={1}>
            <Typography
              component={RouterLink}
              to={getResourceByUsername(resources.UserProfile, entry.user.username)}
              variant="subtitle1"
              fontWeight={800}
              color="inherit"
              sx={{ textDecoration: 'none' }}
              noWrap
            >
              {entry.user.username}
            </Typography>
            {fullName ? (
              <Typography variant="body2" color="rgba(255,255,255,0.82)" noWrap>
                {fullName}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Box>

      <Stack spacing={1.5} sx={{ p: 2.25 }}>
        {loginRequired && isVotingOpen ? (
          <Button component={RouterLink} to={resources.Login} variant="outlined">
            {t('kepCover.actions.signIn')}
          </Button>
        ) : (
          <LoadingButton
            variant={entry.isLiked ? 'contained' : 'outlined'}
            color={entry.isLiked ? 'error' : 'primary'}
            loading={isVoting}
            disabled={!isVotingOpen || !canVote}
            onClick={() => onVote?.(entry.id)}
          >
            {entry.isLiked ? t('kepCover.actions.unlike') : t('kepCover.actions.like')}
          </LoadingButton>
        )}
      </Stack>
    </Paper>
  );
};

export default KepCoverEntryCard;
