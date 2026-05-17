import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { formatDateTime } from 'shared/lib/dateTime';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import type { HomePromoSlide } from 'modules/home/domain/entities/home-promo.entity';

const accentColorMap = {
  warning: 'warning',
  info: 'info',
  success: 'success',
} as const;

const HomePromoBaseCard = ({ slide }: { slide: HomePromoSlide }) => {
  const { t } = useTranslation();
  const paletteColor = accentColorMap[slide.accent];
  const dateLabel =
    slide.status === 'active'
      ? t('homePage.promos.endsAt', { date: formatDateTime(slide.endTime, 'compactDateTime') })
      : t('homePage.promos.startsAt', {
          date: formatDateTime(slide.startTime, 'compactDateTime'),
        });

  return (
    <Box
      sx={(theme) => {
        const palette = theme.vars.palette[paletteColor];

        return {
          overflow: 'hidden',
          position: 'relative',
          borderRadius: 4,
          background: `linear-gradient(135deg, ${cssVarRgba(palette.mainChannel, 0.16)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)})`,
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
        };
      }}
    >
      <Box
        sx={(theme) => {
          const palette = theme.vars.palette[paletteColor];

          return {
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at top left, ${cssVarRgba(palette.mainChannel, 0.22)}, transparent 38%), radial-gradient(circle at bottom right, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14)}, transparent 35%)`,
          };
        }}
      />

      <Stack spacing={3} sx={{ ...responsivePagePaddingSx, position: 'relative' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3}>
          <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip label={slide.typeLabel} color={paletteColor} variant="filled" />
              <Typography variant="body2" color="text.secondary">
                {dateLabel}
              </Typography>
            </Stack>

            <Typography variant="h4" fontWeight={900} sx={{ maxWidth: 760 }}>
              {slide.title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
              {slide.subtitle}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
              {slide.metrics.map((metric) => (
                <Paper
                  key={`${slide.id}-${metric.label}`}
                  sx={(theme) => ({
                    p: 1.5,
                    minWidth: 160,
                    backgroundColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.58),
                    backdropFilter: 'blur(8px)',
                  })}
                >
                  <Typography variant="caption" color="text.secondary">
                    {metric.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={800}>
                    {metric.value}
                  </Typography>
                </Paper>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button component={RouterLink} to={slide.href} variant="contained" color={paletteColor}>
                {slide.ctaLabel}
              </Button>
              <Chip
                label={t(`homePage.promos.statuses.${slide.status}`)}
                color={slide.status === 'active' ? paletteColor : 'default'}
                variant="outlined"
              />
            </Stack>
          </Stack>

          <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>
            {slide.previewImages?.length ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 1.5,
                  alignItems: 'stretch',
                }}
              >
                {slide.previewImages.map((image, index) => (
                  <Box
                    key={`${slide.id}-preview-${index}`}
                    sx={{
                      minHeight: 136,
                      borderRadius: 3,
                      overflow: 'hidden',
                      backgroundImage: `url(${image})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Paper
                sx={(theme) => ({
                  height: '100%',
                  minHeight: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.5),
                  backdropFilter: 'blur(10px)',
                })}
              >
                <IconifyIcon icon={slide.icon} fontSize={88} color="rgba(15,23,42,0.28)" />
              </Paper>
            )}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default HomePromoBaseCard;
