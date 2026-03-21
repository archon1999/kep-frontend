import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Box, IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { getResourceById, resources } from 'app/routes/resources.ts';
import type { BlogPost } from 'modules/blog/domain/entities/blog.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Image from 'shared/components/base/Image';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';
import { responsivePagePaddingSx } from 'shared/lib/styles.ts';
import { cssVarRgba } from 'shared/lib/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { useHomeNews } from '../../application/queries';
import type { HomeNewsList } from '../../domain/entities/home.entity';

type NewsItem = HomeNewsList['data'][number];

const mapTags = (tags?: string | string[] | null): string[] => {
  if (Array.isArray(tags)) {
    return tags.filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const mapNewsToPost = (news: NewsItem): BlogPost => ({
  id: Number(news.blog.id ?? 0),
  author: {
    username: news.blog.author.username,
    avatar: news.blog.author.avatar ?? null,
    bio: '',
  },
  title: news.blog.title,
  body: '',
  bodyShort: news.blog.bodyShort ?? undefined,
  image: news.blog.image ?? null,
  views: news.blog.views ?? 0,
  likesCount: news.blog.likesCount ?? 0,
  commentsCount: news.blog.commentsCount ?? 0,
  tags: mapTags(news.blog.tags),
  topics: [],
  created: news.blog.created,
});

interface CustomNavButtonProps extends PropsWithChildren {
  onClick: () => void;
  sx?: any;
}

export const CustomNavButton = ({ children, onClick, sx }: CustomNavButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      sx={(theme) => ({
        color: theme.vars.palette.primary.main,
        backgroundColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.15),
        width: 30,
        height: 30,
        '&:hover': {
          backgroundColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.25),
        },
        ...sx,
      })}
    >
      {children}
    </IconButton>
  );
};

export const SwiperNavigation = () => {
  const swiper = useSwiper();

  return (
    <Stack direction="row" gap={1} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
      <CustomNavButton onClick={() => swiper.slidePrev()}>
        <IconifyIcon icon="material-symbols:keyboard-arrow-left" fontSize={24} />
      </CustomNavButton>

      <CustomNavButton onClick={() => swiper.slideNext()}>
        <IconifyIcon icon="material-symbols:keyboard-arrow-right" fontSize={24} />
      </CustomNavButton>
    </Stack>
  );
};

interface CardWrapperProps extends PropsWithChildren {
  sx?: any;
}

export const CardWrapper = ({ children, sx }: CardWrapperProps) => {
  const { isDark } = useResolvedThemeMode();

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.vars.palette.background.elevation1,
        backgroundImage: [
          `linear-gradient(142deg, ${alpha(theme.palette.background.paper, isDark ? 0.98 : 0.99)} 14%, ${alpha(theme.palette.background.default, isDark ? 0.96 : 0.92)} 100%)`,
          `radial-gradient(circle at 16% 42%, ${alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08)} 0%, transparent 24%)`,
          `radial-gradient(circle at 86% 70%, ${alpha(theme.palette.secondary.main, isDark ? 0.14 : 0.08)} 0%, transparent 22%)`,
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, isDark ? 0.04 : 0.58)} 0%, transparent 100%)`,
        ].join(','),
        borderRadius: theme.spacing(3),
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: { xs: 3, lg: 5 },
        isolation: 'isolate',

        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: { xs: 260, sm: 320, lg: 380 },
          aspectRatio: '1 / 1',
          borderRadius: '32%',
          pointerEvents: 'none',
          opacity: isDark ? 0.84 : 0.96,
          border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.22 : 0.12)}`,
          backgroundImage: [
            `radial-gradient(circle at 38% 48%, ${alpha(theme.palette.common.white, isDark ? 0.2 : 0.6)} 0%, transparent 16%)`,
            `radial-gradient(circle at 38% 48%, ${alpha(theme.palette.primary.main, isDark ? 0.86 : 0.76)} 0%, ${alpha(theme.palette.primary.main, isDark ? 0.72 : 0.62)} 18%, ${alpha(theme.palette.secondary.main, isDark ? 0.38 : 0.22)} 30%, transparent 58%)`,
            `radial-gradient(circle at 42% 50%, ${alpha(theme.palette.primary.light, isDark ? 0.5 : 0.38)} 0%, transparent 42%)`,
            `repeating-linear-gradient(0deg, ${alpha(theme.palette.common.white, isDark ? 0.02 : 0.05)} 0 2px, transparent 2px 6px)`,
            `repeating-linear-gradient(90deg, ${alpha(theme.palette.common.black, isDark ? 0.04 : 0.025)} 0 1px, transparent 1px 5px)`,
            `linear-gradient(145deg, ${alpha(theme.palette.background.paper, isDark ? 0.24 : 0.3)} 0%, ${alpha(theme.palette.primary.main, isDark ? 0.18 : 0.1)} 100%)`,
          ].join(','),
          boxShadow: [
            `0 0 0 1px ${alpha(theme.palette.common.white, isDark ? 0.04 : 0.22)} inset`,
            `0 28px 100px -54px ${alpha(theme.palette.primary.main, isDark ? 0.76 : 0.46)}`,
            `0 14px 40px -24px ${alpha(theme.palette.common.black, isDark ? 0.42 : 0.14)}`,
          ].join(','),
        },
        '&::before': {
          left: { xs: '-40%', sm: '-20%', lg: '-13%' },
          top: { xs: '-12%', sm: '-20%', lg: '-18%' },
          transform: 'rotate(-14deg)',
        },
        '&::after': {
          right: { xs: '-40%', sm: '-18%', lg: '-11%' },
          bottom: { xs: '-20%', sm: '-30%', lg: '-26%' },
          transform: 'rotate(10deg) scale(0.98)',
        },
        '& > *': {
          position: 'relative',
          zIndex: 1,
        },

        '& .swiper-pagination': {
          top: theme.spacing(1.5),
          left: 0,
          width: 'auto',
          display: 'flex',
          right: 'auto',
          bottom: 'auto',
        },
        '& .swiper-pagination-bullet': {
          backgroundColor: `${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.25)} !important`,
          borderRadius: `${theme.spacing(1.5)} !important`,
          width: theme.spacing(2),
          height: theme.spacing(0.5),
          margin: theme.spacing(0, 0.5),
          transition: 'all 0.3s ease',
        },
        '& .swiper-pagination-bullet-active': {
          backgroundColor: `${theme.vars.palette.primary.main} !important`,
          opacity: 1,
          width: `${theme.spacing(4)} !important`,
        },
        '& .swiper-button-disabled': {
          opacity: '1 !important',
          pointerEvents: 'auto',
        },
        ...sx,
      })}
    >
      {children}
    </Box>
  );
};

const NewsSection = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useHomeNews();

  const newsPosts = useMemo(() => data?.data?.map(mapNewsToPost) ?? [], [data]);

  return (
    <Paper>
      <Stack direction="column" spacing={3} sx={responsivePagePaddingSx}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t('homePage.news.title')}
        </Typography>

        {isLoading ? (
          <CardWrapper>
            <Box
              sx={{
                height: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  gridColumn: '3/4',
                  pt: 5,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
              </Stack>
            </Box>
          </CardWrapper>
        ) : newsPosts.length ? (
          <CardWrapper>
            <Swiper
              modules={[Navigation, Pagination, A11y, Autoplay]}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{
                pauseOnMouseEnter: true,
                delay: 5000,
              }}
              loop={true}
            >
              <SwiperNavigation />
              {newsPosts.map((post) => {
                return (
                  <SwiperSlide key={post.id} style={{ height: '100%' }}>
                    <Box
                      component={Link}
                      to={getResourceById(resources.BlogPost, post.id)}
                      sx={{
                        textDecoration: 'none',
                        height: 1,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Stack
                        direction="column"
                        justifyContent="space-between"
                        sx={{ height: 1, gridColumn: { xs: '1/-1', sm: '1/3' } }}
                      >
                        <div></div>
                        <Stack
                          direction="column"
                          sx={{
                            gap: 2,
                            width: 1,
                            pt: 6,
                            pb: 5,
                            maxWidth: { xs: 'none', lg: 280 },
                          }}
                        >
                          <Typography
                            variant="h5"
                            lineHeight={1.2}
                            sx={{
                              typography: { xs: 'h4', md: 'h5', lg: 'h4' },
                              color: 'primary.dark',
                            }}
                          >
                            {post.title}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: 'primary.main',
                              maxWidth: 320,
                            }}
                            dangerouslySetInnerHTML={{ __html: post.bodyShort ?? '' }}
                          ></Typography>
                        </Stack>
                      </Stack>

                      <Stack
                        sx={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          gridColumn: '3/4',
                          pt: 5,
                          display: { xs: 'none', sm: 'block' },
                        }}
                      >
                        <Image
                          src={post.image ?? ''}
                          sx={{
                            alignSelf: 'center',
                            objectFit: 'contain',
                            width: 1,
                          }}
                        />
                      </Stack>
                    </Box>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </CardWrapper>
        ) : (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ flex: 1 }}
          >
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {t('homePage.news.empty')}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default NewsSection;
