import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  ButtonBase,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { interactiveContentSx } from 'app/theme/styles/content';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';

type Chapter = { id: number; title: string; icon: string; count: number; completed: number };
const TopicCard = ({
  chapter,
  onClick,
  loading = false,
}: {
  chapter?: Chapter;
  onClick?: () => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const progress = chapter?.count ? Math.min(chapter.completed / chapter.count, 1) : 0;
  const label = chapter
    ? t('tests.chapterProgress', { completed: chapter.completed, total: chapter.count })
    : '';
  return (
    <Box component="article" data-topic-progress={progress} aria-busy={loading}>
      <ButtonBase
        onClick={onClick}
        disabled={loading}
        aria-label={chapter ? chapter.title + ', ' + label : undefined}
        sx={{
          ...interactiveContentSx,
          width: 1,
          height: 1,
          p: 2.5,
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 2,
          textAlign: 'start',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          {loading ? (
            <Skeleton variant="rectangular" width={44} height={44} />
          ) : (
            <Avatar
              src={chapter?.icon}
              alt=""
              variant="square"
              sx={{
                width: 44,
                height: 44,
                bgcolor: 'transparent',
                '& img': { objectFit: 'contain' },
              }}
            >
              <IconifyIcon icon="mdi:book-open-page-variant-outline" sx={{ fontSize: 30 }} />
            </Avatar>
          )}
          {loading ? (
            <Skeleton width={32} />
          ) : (
            <Typography variant="metric" color="text.secondary" sx={{ fontSize: 20 }}>
              {chapter?.count ?? 0}
            </Typography>
          )}
        </Stack>
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--kep-display-font)',
            fontSize: 18,
            lineHeight: 1.4,
            fontWeight: 500,
            minHeight: 26,
          }}
        >
          {loading ? <Skeleton width="75%" /> : <MixedText>{chapter?.title ?? ''}</MixedText>}
        </Typography>
        <Stack gap={0.75} sx={{ mt: 'auto' }}>
          {loading ? (
            <Skeleton height={18} width="70%" />
          ) : (
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          )}
          <LinearProgress
            variant="determinate"
            value={progress * 100}
            color={progress === 1 ? 'success' : 'primary'}
            aria-label={label}
            sx={{ height: 3, bgcolor: 'action.selected' }}
          />
        </Stack>
      </ButtonBase>
    </Box>
  );
};
export default TopicCard;
