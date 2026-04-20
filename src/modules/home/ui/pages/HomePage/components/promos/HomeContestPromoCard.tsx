import dayjs from 'dayjs';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import type { HomePromoSlide } from 'modules/home/domain/entities/home-promo.entity';

const HomeContestPromoCard = ({ slide }: { slide: HomePromoSlide }) => {
  const { t } = useTranslation();
  const paletteColor = slide.status === 'active' ? 'success' : 'warning';
  const statusLabel =
    slide.status === 'active'
      ? t('contests.statusShort.live')
      : t('contests.statusShort.notStarted');
  const durationMinutes =
    slide.startTime && slide.endTime
      ? Math.max(dayjs(slide.endTime).diff(dayjs(slide.startTime), 'minute'), 0)
      : 0;
  const startLabel = t('contests.startsLabel', { date: '' }).trim();
  const endLabel = t('contests.endsLabel', { date: '' }).trim();

  return (
    <Card
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.success.mainChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.1)})`,
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
          background: `radial-gradient(circle at 18% 12%, ${cssVarRgba(theme.vars.palette.success.mainChannel, 0.18)}, transparent 34%), radial-gradient(circle at 86% 16%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.18)}, transparent 28%)`,
          '&::after': slide.logo
            ? {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${slide.logo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.05,
                filter: 'saturate(0.75)',
              }
            : undefined,
        })}
      />

      <Box
        sx={{
          position: 'absolute',
          right: { xs: -20, md: 12 },
          bottom: { xs: -30, md: -6 },
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <IconifyIcon icon={slide.icon} fontSize={220} />
      </Box>

      <CardContent sx={{ ...responsivePagePaddingSx, position: 'relative' }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Stack spacing={1.25} sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="contest" fontSize={28} />
                <Typography variant="h4" fontWeight={900} sx={{ wordBreak: 'break-word' }}>
                  {slide.title}
                </Typography>
              </Stack>

              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                {slide.subtitle}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip
                  size="small"
                  color="primary"
                  variant="outlined"
                  label={slide.typeLabel}
                />
                <Chip
                  size="small"
                  color={slide.isRated ? 'secondary' : 'default'}
                  variant={slide.isRated ? 'filled' : 'outlined'}
                  label={t(slide.isRated ? 'contests.rated' : 'contests.unrated')}
                />
                <Chip
                  size="small"
                  color="primary"
                  icon={<IconifyIcon icon="mdi:clock-outline" fontSize={16} />}
                  label={`${durationMinutes} min`}
                />
                <Chip
                  size="small"
                  color="primary"
                  icon={<IconifyIcon icon="mdi:help-circle-outline" fontSize={16} />}
                  label={t('contests.problems', { count: slide.problemsCount ?? 0 })}
                />
              </Stack>
            </Stack>

            <Chip label={statusLabel} color={paletteColor} sx={{ fontWeight: 700 }} />
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
                  {startLabel}
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
                  {endLabel}
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
                  minWidth: 220,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {t('homePage.promos.metrics.registrants')}
                </Typography>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                  <Typography variant="body2" fontWeight={800}>
                    {t('contests.registrantsLabel', { count: slide.registrantsCount ?? 0 })}
                  </Typography>
                </Stack>
              </Card>

              <Button component={RouterLink} to={slide.href} variant="contained" color={paletteColor}>
                {slide.ctaLabel}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HomeContestPromoCard;
