import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import type { HomePromoSlide } from '../../../domain/entities/home-promo.entity';

const HomeArenaPromoCard = ({ slide }: { slide: HomePromoSlide }) => {
  const { t } = useTranslation();

  const statusLabel =
    slide.status === 'active' ? t('arena.status.live') : t('arena.status.upcoming');
  const durationMinutes =
    slide.startTime && slide.endTime
      ? Math.max(dayjs(slide.endTime).diff(dayjs(slide.startTime), 'minute'), 0)
      : 0;

  return (
    <Card
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.warning.lightChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.06)})`,
        '& .swiper-pagination': {
          bottom: 0,
        },
        '& .swiper-pagination-bullet': {
          backgroundColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.25),
          width: theme.spacing(1),
          height: theme.spacing(1),
          opacity: 1,
        },
        '& .swiper-pagination-bullet-active': {
          backgroundColor: theme.vars.palette.primary.main,
          width: theme.spacing(2.5),
          borderRadius: theme.spacing(1),
        },
      })}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 85% 15%, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.16)}, transparent 32%)`,
        })}
      />

      <Box
        sx={{
          position: 'absolute',
          right: { xs: -20, md: 20 },
          bottom: { xs: -24, md: 0 },
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <IconifyIcon icon="mdi:sword-cross" fontSize={220} />
      </Box>

      <CardContent sx={{ ...responsivePagePaddingSx, position: 'relative' }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Stack spacing={1.25} sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconifyIcon icon="mdi:sword-cross" color="warning.main" fontSize={28} />
                <Typography variant="h4" fontWeight={900} sx={{ wordBreak: 'break-word' }}>
                  {slide.title}
                </Typography>
              </Stack>

              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                {slide.subtitle}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip
                  color="warning"
                  size="small"
                  label={`${durationMinutes} ${t('arena.minutes')}`}
                />
                <Chip
                  color="warning"
                  size="small"
                  icon={<IconifyIcon icon="mdi:alarm" fontSize={16} />}
                  label={`${slide.timeSeconds ?? 0}s`}
                />
                <Chip
                  color="warning"
                  size="small"
                  icon={<IconifyIcon icon="mdi:help-circle-outline" fontSize={16} />}
                  label={`${slide.questionsCount ?? 0} ${t('arena.questions')}`}
                />
                {(slide.chapterTitles ?? []).slice(0, 4).map((chapterTitle) => (
                  <Chip
                    key={`${slide.id}-${chapterTitle}`}
                    size="small"
                    color="primary"
                    label={chapterTitle}
                  />
                ))}
              </Stack>
            </Stack>

            <Chip
              label={statusLabel}
              color={slide.status === 'active' ? 'success' : 'warning'}
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          <Divider sx={{ opacity: 0.7 }} />

          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', lg: 'center' }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flex: 1 }}>
              <Card
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {t('arena.timeline.start')}
                </Typography>
                <Typography fontWeight={800}>
                  {slide.startTime ? dayjs(slide.startTime).format('DD MMM, HH:mm') : '-'}
                </Typography>
              </Card>

              <Card
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {t('arena.timeline.finish')}
                </Typography>
                <Typography fontWeight={800}>
                  {slide.endTime ? dayjs(slide.endTime).format('DD MMM, HH:mm') : '-'}
                </Typography>
              </Card>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  p: 1.5,
                  minWidth: 140,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {t('homePage.promos.metrics.questions')}
                </Typography>
                <Typography variant="body2" fontWeight={800}>
                  {slide.questionsCount ?? 0} {t('arena.questions')}
                </Typography>
              </Card>

              <Button component={RouterLink} to={slide.href} variant="contained" color="warning">
                {slide.ctaLabel}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HomeArenaPromoCard;
