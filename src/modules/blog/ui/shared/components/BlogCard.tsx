import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Avatar, Box, Stack, SxProps, Theme, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { contentEntranceStyles, motion } from 'app/theme/styles/transitions';
import { estimateBlogReadTime } from 'modules/blog/application/blog-content';
import { stripBlogHtml } from 'modules/blog/application/blog-content';
import { BlogPost } from 'modules/blog/domain/entities/blog.entity';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import KepIcon from 'shared/components/base/KepIcon';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { formatDateTimeOrOriginal } from 'shared/lib/dateTime';
import { formatNumber } from 'shared/lib/utils';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  variant?: 'default' | 'horizontal' | 'home';
  emphasis?: 'regular' | 'highlight' | 'featured';
  sx?: SxProps<Theme>;
}

const BlogCard = ({ post, featured = false, variant = 'default', emphasis, sx }: BlogCardProps) => {
  const { t } = useTranslation();
  const isFeatured = featured || emphasis === 'featured';
  const horizontal = isFeatured || variant === 'horizontal';
  const url = getResourceById(resources.BlogPost, post.id);
  const excerpt = post.subtitle || stripBlogHtml(post.bodyShort ?? post.body);
  const date = formatDateTimeOrOriginal(
    post.publishedAt ?? post.created ?? post.updatedAt ?? '',
    'compactDate',
  );
  const topic = post.topics[0]?.title || post.tags[0];

  return (
    <Box
      component="article"
      sx={[
        {
          ...contentEntranceStyles,
          height: '100%',
          minWidth: 0,
          display: 'grid',
          gridTemplateColumns: horizontal
            ? { xs: '1fr', md: isFeatured ? '1fr 1fr' : '220px 1fr' }
            : '1fr',
          bgcolor: 'background.default',
          position: 'relative',
          '&:hover .blog-card-title, &:focus-within .blog-card-title': { color: 'primary.main' },
          '@media (hover: hover) and (pointer: fine)': {
            '&:hover .blog-card-image': { transform: 'scale(1.025)' },
          },
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
            '& .blog-card-image, &:hover .blog-card-image': {
              transition: 'none',
              transform: 'none',
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        component={RouterLink}
        to={url}
        tabIndex={-1}
        aria-hidden="true"
        sx={{
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          position: 'relative',
          minWidth: 0,
          aspectRatio: horizontal ? { xs: '16 / 9', md: 'auto' } : '16 / 9',
          minHeight: isFeatured ? { md: 310 } : undefined,
          bgcolor: 'background.level1',
          borderBottom: { xs: 1, md: horizontal ? 0 : 1 },
          borderRight: { md: horizontal ? 1 : 0 },
          borderColor: 'divider',
        }}
      >
        {post.image ? (
          <Box
            className="blog-card-image"
            component="img"
            src={post.image}
            alt=""
            loading={isFeatured ? 'eager' : 'lazy'}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: `transform 380ms ${motion.easing}`,
            }}
          />
        ) : (
          <PatternArtwork kind="blog" sx={{ width: isFeatured ? 280 : 220 }} />
        )}
      </Box>
      <Stack
        direction="column"
        gap={2}
        sx={{ p: isFeatured ? { xs: 2.5, md: 4 } : 2.5, minWidth: 0, justifyContent: 'center' }}
      >
        <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center">
          {topic && (
            <Typography
              variant="overline"
              color="primary.main"
              sx={{
                fontSize: 10,
                lineHeight: 1.5,
                letterSpacing: '.1em',
                overflowWrap: 'anywhere',
              }}
            >
              {topic}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {t('blog.minRead', { count: estimateBlogReadTime(post.body ?? post.bodyShort) })}
          </Typography>
        </Stack>
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--kep-display-font)',
            fontSize: isFeatured ? { xs: 27, md: 36 } : 23,
            fontWeight: 500,
            lineHeight: 1.25,
            letterSpacing: '-.025em',
            overflowWrap: 'anywhere',
          }}
        >
          <Box
            component={RouterLink}
            to={url}
            className="blog-card-title"
            sx={{
              color: 'text.primary',
              textDecoration: 'none',
              transition: 'color .2s',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: isFeatured ? 4 : 3,
              overflow: 'hidden',
            }}
          >
            <MixedText>{post.title}</MixedText>
          </Box>
        </Typography>
        {excerpt && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: isFeatured ? 3 : 2,
              overflow: 'hidden',
              overflowWrap: 'anywhere',
            }}
          >
            {excerpt}
          </Typography>
        )}
        <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 'auto', pt: 0.5 }}>
          <Avatar src={post.author.avatar ?? undefined} alt="" sx={{ width: 24, height: 24 }} />
          <Box sx={{ minWidth: 0 }}>
            <UserPopover username={post.author.username} avatar={post.author.avatar ?? undefined}>
              <Typography
                variant="caption"
                sx={{ color: 'text.primary', textDecoration: 'none', overflowWrap: 'anywhere' }}
              >
                {post.author.username}
              </Typography>
            </UserPopover>
            {date && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', fontSize: 11 }}
              >
                {date}
              </Typography>
            )}
          </Box>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          gap={2}
          alignItems="center"
          sx={{ pt: 1.5, borderTop: 1, borderColor: 'divider' }}
        >
          <Typography
            component={RouterLink}
            to={url}
            variant="caption"
            color="primary.main"
            sx={{
              textDecoration: 'none',
              display: 'inline-flex',
              gap: 1,
              alignItems: 'center',
              fontWeight: 600,
            }}
          >
            {t('blog.readMore')} <span aria-hidden="true">↗</span>
          </Typography>
          <Stack direction="row" spacing={1.5} color="text.secondary">
            {(
              [
                { icon: 'view', value: post.views, label: 'blog.views' },
                { icon: 'like', value: post.likesCount, label: 'blog.likes' },
              ] as const
            ).map((stat) => (
              <Stack
                key={stat.icon}
                direction="row"
                gap={0.5}
                alignItems="center"
                aria-label={`${t(stat.label)}: ${stat.value}`}
              >
                <KepIcon name={stat.icon} fontSize={14} />
                <Typography variant="caption">{formatNumber(stat.value)}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
export default BlogCard;
