import { Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { resources } from 'app/routes/resources.ts';
import { useHomeUpdates } from 'modules/home/application/queries';
import SystemUpdateLikeButton from 'modules/home/ui/shared/components/SystemUpdateLikeButton';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { formatDateTime } from 'shared/lib/dateTime';
import { createSafeHtml } from 'shared/lib/safeHtml';
import { responsivePagePaddingSx } from 'shared/lib/styles.ts';

const UpdatesSection = () => {
  const { t } = useTranslation();
  const { data, isLoading, mutate } = useHomeUpdates();
  const updates = data?.data ?? [];

  const getUpdateIcon = (updateType: string) =>
    updateType === 'new' ? 'material-symbols:add-circle-outline-rounded' : 'mdi:update';

  return (
    <Paper sx={{ height: '100%' }}>
      <Stack direction="column" spacing={3} sx={responsivePagePaddingSx}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t('homePage.updates.title')}
          </Typography>

          <Button component={RouterLink} to={resources.Updates} variant="outlined">
            {t('homePage.updates.viewAll')}
          </Button>
        </Stack>

        {isLoading ? (
          <Stack direction="column" spacing={2}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={116} sx={{ borderRadius: 3 }} />
            ))}
          </Stack>
        ) : updates.length ? (
          <Stack direction="column">
            {updates.map((update, index) => (
              <Box
                key={update.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '52px minmax(0, 1fr)',
                  columnGap: 2,
                }}
              >
                <Stack alignItems="center" sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      display: 'grid',
                      placeItems: 'center',
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      bgcolor: 'primary.lighter',
                    }}
                  >
                    <IconifyIcon icon={getUpdateIcon(update.updateType)} sx={{ fontSize: 20, color: 'primary.dark' }} />
                  </Box>

                  {index !== updates.length - 1 && (
                    <Box
                      sx={(theme) => ({
                        width: 2,
                        flex: 1,
                        minHeight: 76,
                        mt: 1,
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: theme.vars.palette.divider,
                      })}
                    />
                  )}
                </Stack>

                <Box sx={{ minWidth: 0, pb: index !== updates.length - 1 ? 3 : 0 }}>
                  <Stack direction="column" spacing={1} sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={800}>
                      {update.title}
                    </Typography>
                    <Typography
                      component="div"
                      variant="body2"
                      color="text.secondary"
                      dangerouslySetInnerHTML={createSafeHtml(update.description)}
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        '& p': { m: 0 },
                      }}
                    />
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" color="text.disabled" fontWeight={700}>
                        {formatDateTime(update.date, 'compactDate')}
                      </Typography>
                      <SystemUpdateLikeButton update={update} onChanged={() => mutate()} />
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.updates.empty')}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default UpdatesSection;
