import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Alert, Box, Button, Paper, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useHomeUpdates } from 'modules/home/application/queries';
import type { HomeSystemUpdate } from 'modules/home/domain/entities/home.entity';
import SystemUpdateLikeButton from 'modules/home/ui/shared/components/SystemUpdateLikeButton';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import { PointerSpotlight } from 'shared/components/motion/InteractionEffects';
import { formatDateTime, formatDateTimePattern } from 'shared/lib/dateTime';
import { createSafeHtml } from 'shared/lib/safeHtml';
import DashboardFeed from './DashboardFeed';
import { DashboardPattern } from './DashboardPattern';

const UpdatePreviewRow = ({
  update,
  compact,
  onChanged,
}: {
  update?: HomeSystemUpdate;
  compact: boolean;
  onChanged?: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Box
      component="article"
      data-feed-item
      aria-busy={!update}
      sx={{
        display: 'grid',
        gridTemplateColumns: '40px minmax(0, 1fr) auto',
        gap: 1.5,
        alignItems: 'center',
        height: compact ? 52 : 128,
        py: compact ? 0.5 : 1.5,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        component="time"
        dateTime={update?.date}
        aria-label={update ? formatDateTime(update.date, 'fullDate') : undefined}
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          pr: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.25,
        }}
      >
        <Typography
          component="span"
          variant="metric"
          sx={{ fontSize: 17, color: 'var(--kep-logo-sand)' }}
        >
          {update ? formatDateTimePattern(update.date, 'DD') : <Skeleton width={20} />}
        </Typography>
        <Typography
          component="span"
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.06em' }}
        >
          {update ? formatDateTimePattern(update.date, 'MMM') : <Skeleton width={20} />}
        </Typography>
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" gap={0.75} alignItems="flex-start">
          {update && (
            <Tooltip title={t(`homePage.updates.changeType.${update.updateType}`)}>
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  mt: 0.2,
                  color: update.updateType === 'new' ? 'success.main' : 'primary.main',
                  flexShrink: 0,
                }}
              >
                <IconifyIcon
                  icon={update.updateType === 'new' ? 'mdi:plus' : 'mdi:arrow-top-right'}
                  fontSize={12}
                />
              </Box>
            </Tooltip>
          )}
          <Typography
            component="h3"
            variant="body2"
            title={update?.title}
            sx={{
              flex: 1,
              minWidth: 0,
              fontFamily: 'var(--kep-display-font)',
              fontWeight: 500,
              fontSize: compact ? 13 : 16,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {update ? update.title : <Skeleton width="85%" />}
          </Typography>
        </Stack>
        {!compact &&
          (update ? (
            <Typography
              component="div"
              variant="body2"
              color="text.secondary"
              dangerouslySetInnerHTML={createSafeHtml(update.description)}
              sx={{
                mt: 0.75,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                '& p': { m: 0 },
              }}
            />
          ) : (
            <Box sx={{ mt: 0.75 }}>
              <Skeleton width="100%" />
              <Skeleton width="75%" />
            </Box>
          ))}
      </Box>
      {update ? (
        <SystemUpdateLikeButton update={update} compact onChanged={onChanged} />
      ) : (
        <Skeleton variant="rounded" width={40} height={32} />
      )}
    </Box>
  );
};

const UpdatesSection = ({ compact = false }: { compact?: boolean }) => {
  const { t } = useTranslation();
  const previewCount = 7;
  const { data, isLoading, error, mutate } = useHomeUpdates(previewCount);
  const updates = data?.data.slice(0, previewCount) ?? [];
  return (
    <Paper
      component={PointerSpotlight}
      variant="section"
      className="kep-dashboard-updates-card"
      sx={{ height: '100%', p: 'var(--kep-content-inset)' }}
    >
      <Stack
        direction="row"
        gap={1.5}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ mb: 2 }}
      >
        <Typography component="h2" variant="h5" sx={{ flex: 1 }}>
          <MixedText>{t('homePage.updates.title')}</MixedText>
        </Typography>
        <DashboardPattern kind="writing" inline />
        <Button component={RouterLink} to={resources.Updates} variant="text" size="small">
          {t('homePage.updates.viewAll')}
        </Button>
      </Stack>
      <DashboardFeed label={t('homePage.updates.title')} visibleItems={previewCount}>
        {isLoading ? (
          Array.from({ length: previewCount }, (_, index) => (
            <UpdatePreviewRow key={index} compact={compact} />
          ))
        ) : error ? (
          <Alert
            severity="error"
            action={<Button onClick={() => void mutate()}>{t('common.retry')}</Button>}
          >
            {t('common.loadFailed')}
          </Alert>
        ) : updates.length ? (
          updates.map((update) => (
            <UpdatePreviewRow
              key={update.id}
              update={update}
              compact={compact}
              onChanged={() => void mutate()}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.updates.empty')}
          </Typography>
        )}
      </DashboardFeed>
    </Paper>
  );
};
export default UpdatesSection;
