import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import {
  Badge,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
  cardMediaClasses,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { getResourceById, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import KepIcon from 'shared/components/base/KepIcon';
import { cssVarRgba, formatNumber } from 'shared/lib/utils';
import { BlogPost } from 'modules/blog/domain/entities/blog.entity';
import { estimateBlogReadTime, stripBlogHtml } from 'modules/blog/ui/shared/lib/article-content';

type BlogCardVariant = 'default' | 'horizontal' | 'home';
type BlogCardEmphasis = 'regular' | 'highlight' | 'featured';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  variant?: BlogCardVariant;
  emphasis?: BlogCardEmphasis;
  sx?: SxProps<Theme>;
}

const mergeSx = (base: SxProps<Theme>, extra?: SxProps<Theme>): SxProps<Theme> => {
  if (extra == null) {
    return base;
  }

  const baseEntries = Array.isArray(base) ? base : [base];
  const extraEntries = Array.isArray(extra) ? extra : [extra];

  return [...baseEntries, ...extraEntries] as SxProps<Theme>;
};

const StatPill = ({
  icon,
  value,
  light = false,
}: {
  icon: Parameters<typeof KepIcon>[0]['name'];
  value: number;
  light?: boolean;
}) => (
  <Stack direction="row" spacing={0.5} alignItems="center">
    <KepIcon
      name={icon}
      fontSize={15}
      color={light ? 'rgba(255,255,255,0.82)' : 'rgba(15,23,42,0.58)'}
    />
    <Typography
      variant="caption"
      fontWeight={700}
      color={light ? 'common.white' : 'text.secondary'}
    >
      {formatNumber(value)}
    </Typography>
  </Stack>
);

const formatMetaDate = (value?: string) => {
  if (!value) return '';

  return dayjs(value).isValid() ? dayjs(value).format('DD MMM, YYYY') : value;
};

const MediaFallback = ({
  featured = false,
  soft = false,
}: {
  featured?: boolean;
  soft?: boolean;
}) => (
  <Box
    sx={(theme) => ({
      width: 1,
      height: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: soft
        ? [
            `linear-gradient(145deg, ${cssVarRgba(theme.vars.palette.background.paperChannel, 0.98)} 0%, ${cssVarRgba(theme.vars.palette.background.defaultChannel, 0.92)} 100%)`,
            `radial-gradient(circle at 18% 24%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.16)} 0%, transparent 28%)`,
            `radial-gradient(circle at 78% 78%, ${cssVarRgba(theme.vars.palette.info.mainChannel, 0.12)} 0%, transparent 24%)`,
          ].join(',')
        : `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.3)}, ${cssVarRgba(theme.vars.palette.info.mainChannel, 0.12)} 55%, ${cssVarRgba(theme.vars.palette.common.blackChannel, 0.45)})`,
    })}
  >
    <KepIcon
      name="blog"
      fontSize={featured ? 54 : 42}
      color={soft ? 'rgba(15,23,42,0.22)' : 'rgba(255,255,255,0.72)'}
    />
  </Box>
);

const BlogCard = ({
  post,
  featured = false,
  variant = 'default',
  emphasis = 'regular',
  sx,
}: BlogCardProps) => {
  const { t } = useTranslation();
  const blogUrl = getResourceById(resources.BlogPost, post.id);
  const previewText = stripBlogHtml(post.bodyShort ?? post.body);
  const resolvedEmphasis = featured ? 'featured' : emphasis;
  const excerpt = previewText.slice(
    0,
    resolvedEmphasis === 'featured'
      ? 220
      : variant === 'horizontal'
        ? 150
        : variant === 'home'
          ? 132
          : 120,
  );
  const metaDate = formatMetaDate(post.publishedAt ?? post.created ?? post.updatedAt ?? '');
  const readTime = estimateBlogReadTime(post.bodyShort ?? post.body);
  const primaryTag = post.tags[0];
  const isHorizontal = variant === 'horizontal';
  const isHome = variant === 'home';
  const isEditorial = !isHorizontal && !isHome;
  const mediaTransition = 'transform 0.4s ease, filter 0.4s ease';

  if (isEditorial) {
    const cardHeight = {
      xs: 327,
      sm: 280,
      md: 334,
      lg: resolvedEmphasis === 'featured' ? 576 : 280,
    };

    return (
      <Card
        sx={mergeSx({
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          cursor: 'pointer',
          height: cardHeight,
          backgroundColor: 'background.paper',
          backgroundImage: 'none',
          boxShadow: 'none',
          [`&:hover .${cardMediaClasses.img}`]: {
            transform: 'scale(1.05)',
            filter: 'brightness(1)',
          },
        }, sx)}
      >
        <CardActionArea
          component={RouterLink}
          to={blogUrl}
          sx={{
            height: 1,
            display: 'block',
            outline: 0,
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0 }}>
            {post.image ? (
              <CardMedia
                component="img"
                image={post.image}
                alt={post.title}
                sx={{
                  width: 1,
                  height: 1,
                  objectFit: 'cover',
                  filter: 'brightness(0.7)',
                  transition: mediaTransition,
                  transformOrigin: 'center',
                }}
              />
            ) : (
              <MediaFallback featured={resolvedEmphasis === 'featured'} />
            )}

            <Box
              sx={(theme) => ({
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to bottom, ${cssVarRgba(theme.vars.palette.common.blackChannel, 0)} 0%, ${cssVarRgba(theme.vars.palette.common.blackChannel, 0.55)} 55%, ${cssVarRgba(theme.vars.palette.common.blackChannel, 1)} 100%)`,
              })}
            />

            <Badge
              overlap="circular"
              badgeContent={
                <Box
                  sx={(theme) => ({
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: cssVarRgba(theme.vars.palette.background.paperChannel, 0.96),
                    color: 'text.primary',
                    boxShadow: `0 14px 28px -18px ${cssVarRgba(theme.vars.palette.common.blackChannel, 0.45)}`,
                  })}
                >
                  <KepIcon name="blog" fontSize={22} />
                </Box>
              }
              sx={{ position: 'absolute', top: 44, left: 44 }}
            />
          </Box>

          <CardContent
            sx={{
              position: 'relative',
              zIndex: 1,
              width: 1,
              p: 3,
              height: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                mb={0.25}
              >
                {primaryTag ? <Chip size="small" label={primaryTag} /> : null}
                <Typography variant="caption" color="common.white" fontWeight={600}>
                  {t('blog.minRead', { count: readTime })}
                </Typography>
              </Stack>

              <Typography
                variant={resolvedEmphasis === 'featured' ? 'h5' : 'h6'}
                color="common.white"
                fontWeight={700}
                sx={{
                  lineHeight: 1.15,
                  lineClamp: 2,
                  maxWidth: resolvedEmphasis === 'featured' ? 520 : 'unset',
                }}
              >
                {post.title}
              </Typography>

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2" color="common.white" fontWeight={600} mb={0.5}>
                    {post.author.username}
                  </Typography>
                  {metaDate ? (
                    <Typography variant="caption" color="common.white">
                      {metaDate}
                    </Typography>
                  ) : null}
                </Stack>

                <Stack direction="row" spacing={1.25} alignItems="center">
                  <StatPill icon="view" value={post.views} light />
                  <StatPill icon="like" value={post.likesCount} light />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  if (isHome) {
    return (
      <Card
        sx={mergeSx((theme) => ({
          height: 1,
          borderRadius: 5,
          overflow: 'hidden',
          backgroundImage: [
            `linear-gradient(180deg, ${cssVarRgba(theme.vars.palette.background.paperChannel, 0.98)} 0%, ${cssVarRgba(theme.vars.palette.background.defaultChannel, 0.96)} 100%)`,
            `radial-gradient(circle at 16% 20%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)} 0%, transparent 24%)`,
          ].join(','),
          border: `1px solid ${cssVarRgba(theme.vars.palette.dividerChannel, 0.7)}`,
          boxShadow: 'none',
          transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 22px 40px -30px ${cssVarRgba(theme.vars.palette.common.blackChannel, 0.35)}`,
            borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.22),
          },
          [`&:hover .${cardMediaClasses.img}`]: {
            transform: 'scale(1.04)',
          },
        }), sx)}
      >
        <CardActionArea
          component={RouterLink}
          to={blogUrl}
          sx={{
            height: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Box
            sx={{
              width: 1,
              aspectRatio: '16 / 10',
              overflow: 'hidden',
              bgcolor: 'background.default',
            }}
          >
            {post.image ? (
              <CardMedia
                component="img"
                image={post.image}
                alt={post.title}
                sx={{
                  width: 1,
                  height: 1,
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                }}
              />
            ) : (
              <MediaFallback soft />
            )}
          </Box>

          <CardContent
            sx={{
              flex: 1,
              p: { xs: 2.5, md: 3 },
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              {primaryTag ? <Chip label={primaryTag} size="small" /> : null}
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                {t('blog.minRead', { count: readTime })}
              </Typography>
            </Stack>

            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                lineClamp: 2,
              }}
            >
              {post.title}
            </Typography>

            {excerpt ? (
              <Typography variant="body2" color="text.secondary" sx={{ lineClamp: 3 }}>
                {excerpt}
              </Typography>
            ) : null}

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
              sx={{ mt: 'auto' }}
            >
              <Stack spacing={0.25}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {post.author.username}
                </Typography>
                {metaDate ? (
                  <Typography variant="caption" color="text.secondary">
                    {metaDate}
                  </Typography>
                ) : null}
              </Stack>

              <Stack direction="row" spacing={1.25} alignItems="center">
                <StatPill icon="view" value={post.views} />
                <StatPill icon="like" value={post.likesCount} />
              </Stack>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card
      sx={mergeSx((theme) => ({
        height: 1,
        borderRadius: 4.5,
        p: 1,
        outline: 0,
        overflow: 'hidden',
        backgroundImage: [
          `linear-gradient(180deg, ${cssVarRgba(theme.vars.palette.background.paperChannel, 0.98)} 0%, ${cssVarRgba(theme.vars.palette.background.defaultChannel, 0.96)} 100%)`,
          `radial-gradient(circle at 18% 16%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)} 0%, transparent 22%)`,
        ].join(','),
        border: `1px solid ${cssVarRgba(theme.vars.palette.dividerChannel, 0.78)}`,
        boxShadow: 'none',
        transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 26px 50px -34px ${cssVarRgba(theme.vars.palette.common.blackChannel, 0.35)}`,
        },
        [`&:hover .${cardMediaClasses.img}`]: {
          transform: 'scale(1.04)',
        },
      }), sx)}
    >
      <CardActionArea
        component={RouterLink}
        to={blogUrl}
        sx={{
          height: 1,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            width: { xs: 1, md: 300, lg: 320 },
            maxWidth: { md: 320 },
            aspectRatio: '16 / 10',
            borderRadius: 3,
            overflow: 'hidden',
            flexShrink: 0,
            bgcolor: 'background.default',
          }}
        >
          {post.image ? (
            <CardMedia
              component="img"
              image={post.image}
              alt={post.title}
              sx={{
                width: 1,
                height: 1,
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
            />
          ) : (
            <MediaFallback soft />
          )}
        </Box>

        <CardContent
          sx={{
            flex: 1,
            minWidth: 0,
            px: { xs: 0.5, md: 2.5 },
            py: { xs: 2, md: '14px !important' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              {primaryTag ? <Chip label={primaryTag} size="small" /> : null}
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {t('blog.minRead', { count: readTime })}
              </Typography>
            </Stack>
            {metaDate ? (
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {metaDate}
              </Typography>
            ) : null}
          </Stack>

          <Stack spacing={0.75} flex={1}>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                lineClamp: 2,
              }}
            >
              {post.title}
            </Typography>

            {excerpt ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineClamp: 3,
                }}
              >
                {excerpt}
              </Typography>
            ) : null}
          </Stack>

          <Stack spacing={1.25}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
            >
              <Stack spacing={0.25}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {post.author.username}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {formatNumber(post.views)} {t('blog.views').toLowerCase()}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
                <StatPill icon="comment" value={post.commentsCount} />
                <StatPill icon="like" value={post.likesCount} />
              </Stack>
            </Stack>

            <Typography variant="body2" color="primary.main" fontWeight={700}>
              {t('blog.readMore')}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BlogCard;
