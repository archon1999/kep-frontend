import dayjs from 'dayjs';
import { Link as RouterLink } from 'react-router';
import {
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
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import { cssVarRgba } from 'shared/lib/utils';
import { BlogPost } from '../../domain/entities/blog.entity';
import { estimateBlogReadTime, stripBlogHtml } from '../lib/article-content';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  variant?: 'default' | 'horizontal';
}

const StatPill = ({
  icon,
  value,
}: {
  icon: Parameters<typeof KepIcon>[0]['name'];
  value: number;
}) => (
  <Stack direction="row" spacing={0.5} alignItems="center">
    <KepIcon name={icon} fontSize={15} color="rgba(15,23,42,0.58)" />
    <Typography variant="caption" fontWeight={700} color="text.secondary">
      {value}
    </Typography>
  </Stack>
);

const MediaFallback = ({ featured = false }: { featured?: boolean }) => (
  <Box
    sx={(theme) => ({
      width: 1,
      height: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12)}, ${cssVarRgba(theme.vars.palette.info.mainChannel, 0.08)} 55%, ${cssVarRgba(theme.vars.palette.common.whiteChannel, 0.72)})`,
    })}
  >
    <KepIcon name="blog" fontSize={featured ? 54 : 42} color="rgba(15,23,42,0.24)" />
  </Box>
);

const BlogCard = ({ post, featured = false, variant = 'default' }: BlogCardProps) => {
  const { t } = useTranslation();
  const blogUrl = getResourceById(resources.BlogPost, post.id);
  const previewText = stripBlogHtml(post.bodyShort ?? post.body);
  const excerpt = previewText.slice(0, featured ? 220 : variant === 'horizontal' ? 150 : 120);
  const metaDate = post.publishedAt ?? post.created ?? post.updatedAt ?? '';
  const readTime = estimateBlogReadTime(post.bodyShort ?? post.body);
  const primaryTag = post.tags[0];
  const isHorizontal = variant === 'horizontal' || featured;

  return (
    <Card
      background={1}
      sx={{
        height: 1,
        borderRadius: 4,
        p: 1,
        outline: 0,
        overflow: 'hidden',
        backgroundImage: 'none',
        transition: 'background-color 0.2s ease, transform 0.2s ease',
        '&:hover': {
          bgcolor: 'background.elevation1',
          transform: 'translateY(-2px)',
        },
        [`&:hover .${cardMediaClasses.img}`]: {
          transform: 'scale(1.04)',
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={blogUrl}
        sx={{
          height: 1,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: isHorizontal ? { xs: 'column', md: 'row' } : 'column',
        }}
      >
        <Box
          sx={{
            width: isHorizontal ? { xs: 1, md: featured ? '47%' : 300 } : 1,
            maxWidth: isHorizontal ? { md: featured ? 'unset' : 320 } : 'unset',
            aspectRatio: featured ? '16 / 10' : '16 / 10',
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
            <MediaFallback featured={featured} />
          )}
        </Box>

        <CardContent
          sx={{
            flex: 1,
            minWidth: 0,
            px: { xs: 0.5, md: isHorizontal ? 2.5 : 0.5 },
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
            <Typography variant="subtitle2" fontWeight={700} sx={{ minWidth: 0 }}>
              {post.author.username}
            </Typography>
            {metaDate ? (
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {dayjs(metaDate).format('DD MMM, YYYY')}
              </Typography>
            ) : null}
          </Stack>

          <Stack spacing={0.75} flex={1}>
            <Typography
              variant={featured ? 'h4' : 'h6'}
              fontWeight={800}
              sx={{
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                lineClamp: featured ? 3 : 2,
              }}
            >
              {post.title}
            </Typography>

            {excerpt ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineClamp: featured ? 4 : 3,
                  maxWidth: featured ? 620 : 'unset',
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
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                {primaryTag ? <Chip label={primaryTag} size="small" /> : null}
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {t('blog.minRead', { count: readTime })}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.25} alignItems="center">
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
