import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources.ts';
import bgGradient from 'assets/images/background/1.webp';
import type { BlogPost } from 'modules/blog/domain/entities/blog.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Image from 'shared/components/base/Image';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles.ts';
import { cssVarRgba } from 'shared/lib/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { useHomeNews } from '../../application/queries';
import type { HomeNewsList } from '../../domain/entities/home.entity';
import { Link } from 'react-router';

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
    avatar: news.blog.author.avatar,
  },
  title: news.blog.title,
  bodyShort: news.blog.bodyShort ?? undefined,
  image: news.blog.image ?? null,
  views: news.blog.views ?? 0,
  likesCount: news.blog.likesCount ?? 0,
  commentsCount: news.blog.commentsCount ?? 0,
  tags: mapTags(news.blog.tags),
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
  const { mode } = useThemeMode();

  return (
    <Box
      sx={(theme) => ({
        background:
          mode === 'light'
            ? `
           url(${bgGradient}) no-repeat center 100% / cover,
           linear-gradient(
             0deg,
             ${cssVarRgba(theme.vars.palette.chBlue['950Channel'], 0.02)},
             ${cssVarRgba(theme.vars.palette.chBlue['950Channel'], 0.02)}
           ),
           linear-gradient(
             242.63deg,
             ${cssVarRgba(theme.vars.palette.background.elevation1Channel, 1)} 45.75%,
             ${cssVarRgba(theme.vars.palette.chBlue['50Channel'], 1)} 94.14%,
             ${cssVarRgba(theme.vars.palette.chBlue['100Channel'], 1)} 140.25%
           )`
            : `
           url(${bgGradient}) no-repeat center 65% / cover,
           linear-gradient(
             0deg,
             ${cssVarRgba(theme.vars.palette.chBlue['950Channel'], 0.02)},
             ${cssVarRgba(theme.vars.palette.chBlue['950Channel'], 0.02)}
           ),
           linear-gradient(
             242.63deg,
             ${cssVarRgba(theme.vars.palette.background.elevation1Channel, 1)} 45.75%,
             ${cssVarRgba(theme.vars.palette.chBlue['50Channel'], 1)} 94.14%,
             ${cssVarRgba(theme.vars.palette.chBlue['100Channel'], 1)} 140.25%
           )`,
        borderRadius: theme.spacing(3),
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: { xs: 3, lg: 5 },

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
