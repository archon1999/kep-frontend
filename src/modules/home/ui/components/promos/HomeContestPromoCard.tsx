import dayjs from 'dayjs';
import { Box, Button, Card, CardContent, Chip, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import KepIcon from 'shared/components/base/KepIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import type { HomePromoSlide } from '../../../domain/entities/home-promo.entity';

const HomeContestPromoCard = ({ slide }: { slide: HomePromoSlide }) => {
  const { t } = useTranslation();
  const paletteColor = slide.status === 'active' ? 'success' : 'warning';

  return (
    <Card
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.success.mainChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)})`,
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
          background: `radial-gradient(circle at top left, ${cssVarRgba(theme.vars.palette.success.mainChannel, 0.16)}, transparent 34%), radial-gradient(circle at bottom right, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12)}, transparent 30%)`,
          '&::after': slide.logo
            ? {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${slide.logo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.06,
                filter: 'saturate(0.75)',
              }
            : undefined,
        })}
      />

      <CardContent sx={{ ...responsivePagePaddingSx, position: 'relative' }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2.5} justifyContent="space-between">
            <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <KepIcon name="contest" fontSize={20} />
                <Typography variant="overline" color="text.secondary" fontWeight={700} textTransform="uppercase">
                  {slide.typeLabel}
                </Typography>
                <Chip
                  label={t(slide.isRated ? 'contests.rated' : 'contests.unrated')}
                  size="small"
                  color={slide.isRated ? 'secondary' : 'default'}
                  variant={slide.isRated ? 'filled' : 'outlined'}
                />
                <Chip
                  label={slide.status === 'active' ? t('contests.statusShort.live') : t('contests.statusShort.notStarted')}
                  size="small"
                  color={paletteColor}
                  variant="filled"
                />
              </Stack>

              <Typography variant="h4" fontWeight={900} sx={{ maxWidth: 820, wordBreak: 'break-word' }}>
                {slide.title}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                {slide.subtitle}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
                <Paper
                  sx={(theme) => ({
                    p: 1.5,
                    minWidth: 170,
                    backgroundColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.58),
                    backdropFilter: 'blur(8px)',
                  })}
                >
                  <Typography variant="caption" color="text.secondary">
                    {t('homePage.promos.metrics.schedule')}
                  </Typography>
                  <Typography variant="body2" fontWeight={800}>
                    {slide.status === 'active'
                      ? t('homePage.promos.endsAt', {
                          date: slide.endTime ? dayjs(slide.endTime).format('DD MMM, HH:mm') : '-',
                        })
                      : t('homePage.promos.startsAt', {
                          date: slide.startTime ? dayjs(slide.startTime).format('DD MMM, HH:mm') : '-',
                        })}
                  </Typography>
                </Paper>

                <Paper
                  sx={(theme) => ({
                    p: 1.5,
                    minWidth: 170,
                    backgroundColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.58),
                    backdropFilter: 'blur(8px)',
                  })}
                >
                  <Typography variant="caption" color="text.secondary">
                    {t('homePage.promos.metrics.registrants')}
                  </Typography>
                  <Typography variant="body2" fontWeight={800}>
                    {t('contests.registrantsLabel', { count: slide.registrantsCount ?? 0 })}
                  </Typography>
                </Paper>

                <Paper
                  sx={(theme) => ({
                    p: 1.5,
                    minWidth: 170,
                    backgroundColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.58),
                    backdropFilter: 'blur(8px)',
                  })}
                >
                  <Typography variant="caption" color="text.secondary">
                    {t('homePage.promos.metrics.problems')}
                  </Typography>
                  <Typography variant="body2" fontWeight={800}>
                    {t('contests.problems', { count: slide.problemsCount ?? 0 })}
                  </Typography>
                </Paper>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                <Stack direction="row" spacing={1} alignItems="center">
                  <KepIcon name="users" fontSize={18} />
                  <Typography variant="body2" color="text.primary" fontWeight={700}>
                    {t('contests.contestants', { count: slide.contestantsCount ?? 0 })}
                  </Typography>
                </Stack>

                <Button component={RouterLink} to={slide.href} variant="contained" color={paletteColor}>
                  {slide.ctaLabel}
                </Button>
              </Stack>
            </Stack>

            <Box sx={{ width: { xs: '100%', lg: 290 }, flexShrink: 0 }}>
              <Paper
                sx={(theme) => ({
                  position: 'relative',
                  minHeight: 188,
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: `linear-gradient(180deg, ${cssVarRgba(theme.vars.palette.success.mainChannel, 0.14)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)})`,
                })}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: slide.logo ? `url(${slide.logo})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: slide.logo ? 0.18 : 1,
                  }}
                />

                <Stack
                  justifyContent="space-between"
                  sx={{ position: 'relative', height: '100%', minHeight: 188, p: 2.25 }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Chip label={slide.typeLabel} size="small" color={paletteColor} variant="filled" />
                    <KepIcon name="contest" fontSize={34} />
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      {slide.status === 'active' ? t('homePage.promos.statuses.active') : t('homePage.promos.statuses.upcoming')}
                    </Typography>
                    <Typography variant="h6" fontWeight={900}>
                      {t('contests.problems', { count: slide.problemsCount ?? 0 })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('contests.registrantsLabel', { count: slide.registrantsCount ?? 0 })}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HomeContestPromoCard;
