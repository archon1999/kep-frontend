import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
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
        borderRadius: 0,
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.07)} 62%`,
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
          background: `radial-gradient(circle at 10% 16%, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.18)}, transparent 34%), radial-gradient(circle at 88% 82%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14)}, transparent 30%)`,
        })}
      />

      <Box
        sx={{
          position: 'absolute',
          right: { xs: -30, md: 8 },
          bottom: { xs: -34, md: -16 },
          opacity: 0.07,
          pointerEvents: 'none',
        }}
      >
        <IconifyIcon icon="mdi:notebook-edit-outline" fontSize={200} />
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

              <Typography
                variant="h4"
                fontWeight={900}
                sx={{ maxWidth: 820, letterSpacing: '-0.02em' }}
              >
                {slide.title}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                {slide.subtitle}
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ sm: 'center' }}
              >
                <Button component={RouterLink} to={slide.href} variant="contained" color="warning">
                  {slide.ctaLabel}
                </Button>
              </Stack>
            </Stack>

            <Card
              sx={(theme) => ({
                width: { xs: '100%', lg: 320 },
                flexShrink: 0,
                p: 2.25,
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 18px 42px rgba(15,23,42,0.08)',
              })}
            >
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={t('homePage.promos.blogCreate.previewBadge')}
                    size="small"
                    color="warning"
                    variant="filled"
                  />
                  <IconifyIcon icon="mdi:pencil-outline" fontSize={20} color="warning.main" />
                </Stack>

                <Divider />

                <Stack spacing={1.25}>
                  {slide.metrics.map((metric, index) => (
                    <Stack
                      key={`${metric.label}-${index}`}
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                    >
                      <Box
                        sx={(theme) => ({
                          width: 36,
                          height: 36,
                          borderRadius: 2.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: cssVarRgba(theme.vars.palette.warning.mainChannel, 0.14),
                          flexShrink: 0,
                        })}
                      >
                        <IconifyIcon
                          icon={
                            index === 0
                              ? 'mdi:post-outline'
                              : index === 1
                                ? 'mdi:gift-outline'
                                : 'mdi:send-clock-outline'
                          }
                          fontSize={18}
                          color="warning.main"
                        />
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary">
                          {metric.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={800}>
                          {metric.value}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HomeBlogCreatePromoCard;
