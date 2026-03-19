import { Box, Button, Card, CardContent, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import KepIcon from 'shared/components/base/KepIcon';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import type { HomePromoSlide } from '../../../domain/entities/home-promo.entity';

const HomeBlogCreatePromoCard = ({ slide }: { slide: HomePromoSlide }) => {
  const { t } = useTranslation();

  return (
    <Card
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.09)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.07)} 58%, ${cssVarRgba(theme.vars.palette.common.whiteChannel, 0.62)})`,
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
          background: `radial-gradient(circle at 12% 18%, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.18)}, transparent 34%), radial-gradient(circle at 88% 84%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14)}, transparent 32%)`,
        })}
      />

      <Box
        sx={{
          position: 'absolute',
          right: { xs: -36, md: 12 },
          bottom: { xs: -42, md: -18 },
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <IconifyIcon icon="mdi:notebook-edit-outline" fontSize={220} />
      </Box>

      <CardContent sx={{ ...responsivePagePaddingSx, position: 'relative' }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} justifyContent="space-between">
            <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <KepIcon name="blog" fontSize={20} />
                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                  {slide.typeLabel}
                </Typography>
                <Chip
                  label={t('homePage.promos.blogCreate.availableNow')}
                  color="warning"
                  size="small"
                />
              </Stack>

              <Typography variant="h4" fontWeight={900} sx={{ maxWidth: 820, letterSpacing: '-0.02em' }}>
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
                      minWidth: 170,
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

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                <Button component={RouterLink} to={slide.href} variant="contained" color="warning">
                  {slide.ctaLabel}
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {t('homePage.promos.blogCreate.footerNote')}
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={1.5} sx={{ width: { xs: '100%', lg: 320 }, flexShrink: 0 }}>
              <Paper
                sx={(theme) => ({
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.62),
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 18px 42px rgba(15,23,42,0.1)',
                })}
              >
                <Stack spacing={1.75}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={t('homePage.promos.blogCreate.previewBadge')}
                      size="small"
                      color="warning"
                      variant="filled"
                    />
                    <IconifyIcon icon="mdi:arrow-top-right" fontSize={20} color="warning.main" />
                  </Stack>

                  <Stack spacing={0.75}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                      {t('homePage.promos.blogCreate.previewTitle')}
                    </Typography>
                    <Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1.2 }}>
                      {t('homePage.promos.blogCreate.previewHeadline')}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label={t('homePage.promos.blogCreate.previewTags.story')} size="small" />
                    <Chip label={t('homePage.promos.blogCreate.previewTags.reward')} size="small" />
                    <Chip label={t('homePage.promos.blogCreate.previewTags.review')} size="small" />
                  </Stack>

                  <Divider />

                  <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {slide.metrics[1]?.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={800}>
                        {slide.metrics[1]?.value}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {slide.metrics[2]?.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={800}>
                        {slide.metrics[2]?.value}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>

              <Paper
                sx={(theme) => ({
                  p: 1.75,
                  borderRadius: 3,
                  backgroundColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.54),
                  backdropFilter: 'blur(10px)',
                })}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={(theme) => ({
                      width: 40,
                      height: 40,
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: cssVarRgba(theme.vars.palette.warning.mainChannel, 0.14),
                    })}
                  >
                    <KepIcon name="upload" fontSize={20} color="rgba(15,23,42,0.72)" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={800}>
                      {slide.metrics[0]?.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {slide.metrics[0]?.label}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HomeBlogCreatePromoCard;
