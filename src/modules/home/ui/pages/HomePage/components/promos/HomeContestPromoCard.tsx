import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import type { HomePromoSlide } from 'modules/home/domain/entities/home-promo.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import { formatDateTime } from 'shared/lib/dateTime';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';

interface ContestPromoMeta {
  isActive: boolean;
  paletteColor: 'success' | 'warning';
  startLabel: string;
}

const Shell = ({ children, slide }: { children: ReactNode; slide: HomePromoSlide }) => (
  <Card
    sx={(theme) => ({
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.12)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)} 58%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.04)})`,
      border: '1px solid',
      borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12),
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
        background: `radial-gradient(circle at 14% 18%, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.16)}, transparent 34%), radial-gradient(circle at 85% 14%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12)}, transparent 28%)`,
        '&::after': slide.logo
          ? {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${slide.logo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.06,
              filter: 'saturate(0.65)',
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

    <CardContent sx={{ ...responsivePagePaddingSx, position: 'relative' }}>{children}</CardContent>
  </Card>
);

const RatedChip = ({ slide }: { slide: HomePromoSlide }) => {
  const { t } = useTranslation();

  return (
    <Chip
      size="small"
      color={slide.isRated ? 'success' : 'error'}
      variant={slide.isRated ? 'filled' : 'soft'}
      label={t(slide.isRated ? 'contests.rated' : 'contests.unrated')}
      sx={{ fontWeight: 700 }}
    />
  );
};

const TimeBox = ({ label, value }: { label: ReactNode; value: ReactNode }) => (
  <Card sx={{ flex: 1, borderRadius: 3, p: 2 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={800}>{value}</Typography>
  </Card>
);

const ContestPromoContent = ({
  meta,
  slide,
}: {
  meta: ContestPromoMeta;
  slide: HomePromoSlide;
}) => {
  const { t } = useTranslation();

  return (
    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2.5} alignItems="stretch">
      <Box
        sx={(theme) => ({
          flex: 1,
          p: 2.5,
          borderRadius: 3,
          border: '1px solid',
          borderLeft: '6px solid',
          borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12),
          borderLeftColor: meta.isActive ? 'success.main' : 'primary.main',
          bgcolor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.06),
        })}
      >
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} alignItems="center">
            <KepIcon name="contest" fontSize={24} />
            <Typography variant="overline" color="text.secondary" fontWeight={800}>
              {slide.typeLabel}
            </Typography>
          </Stack>

          <Typography variant="h4" fontWeight={900} sx={{ wordBreak: 'break-word' }}>
            {slide.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {slide.subtitle}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <RatedChip slide={slide} />
          </Stack>
        </Stack>
      </Box>

      <Stack spacing={1.5} sx={{ width: { lg: 290 } }}>
        <TimeBox
          label={meta.startLabel}
          value={
            <>
              {formatDateTime(slide.startTime, 'compactDateTime')} - {formatDateTime(slide.endTime, 'compactDateTime')}
            </>
          }
        />
        <TimeBox
          label={t('homePage.promos.metrics.registrants')}
          value={slide.registrantsCount ?? 0}
        />
        <Button
          component={RouterLink}
          to={slide.href}
          variant="contained"
          color={meta.paletteColor}
        >
          {slide.ctaLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

const HomeContestPromoCard = ({ slide }: { slide: HomePromoSlide }) => {
  const { t } = useTranslation();
  const isActive = slide.status === 'active';
  const meta: ContestPromoMeta = {
    isActive,
    paletteColor: isActive ? 'success' : 'warning',
    startLabel: t('contests.startsLabel', { date: '' }).trim(),
  };

  return (
    <Shell slide={slide}>
      <ContestPromoContent meta={meta} slide={slide} />
    </Shell>
  );
};

export default HomeContestPromoCard;
