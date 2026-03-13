import { Link as RouterLink } from 'react-router';
import { Avatar, Box, Card, CardActionArea, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { BlogPost } from '../../domain/entities/blog.entity';
import { getResourceById, resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import { useTranslation } from 'react-i18next';

interface BlogCardProps {
  post: BlogPost;
}

const BlogStat = ({ icon, value, label }: { icon: Parameters<typeof KepIcon>[0]['name']; value: number; label: string }) => (
  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
    <KepIcon name={icon} fontSize={18} />
    <Typography variant="caption" fontWeight={600} color="text.primary">
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Stack>
);

const BlogCard = ({ post }: BlogCardProps) => {
  const { t } = useTranslation();
  const blogUrl = getResourceById(resources.BlogPost, post.id);

  return (
    <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden', bgcolor: 'none' }}>
      <CardActionArea component={RouterLink} to={blogUrl} sx={{ display: 'block' }}>
        {post.image ? (
          <Box
            component="img"
            src={post.image}
            alt={post.title}
            sx={{ width: '100%', height: 240, objectFit: 'cover' }}
          />
        ) : null}
      </CardActionArea>

      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="column" spacing={2} alignItems="start" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={post.author.avatar} alt={post.author.username} />
            <Stack direction="column" spacing={0.25}>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                {post.author.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {post.created}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1.5} divider={<Divider flexItem orientation="vertical" sx={{ borderStyle: 'dashed' }} />}>
            <BlogStat icon="comment" value={post.commentsCount} label={t('blog.comments')} />
            <BlogStat icon="like" value={post.likesCount} label={t('blog.likes')} />
            <BlogStat icon="view" value={post.views} label={t('blog.views')} />
          </Stack>
        </Stack>

        <Stack direction="column" spacing={1.25}>
          <Typography
            component={RouterLink}
            to={blogUrl}
            variant="h6"
            sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 800 }}
          >
            {post.title}
          </Typography>

          {post.tags.length ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {post.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ borderRadius: 2 }} />
              ))}
            </Stack>
          ) : null}
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            component={RouterLink}
            to={blogUrl}
            variant="body2"
            color="primary"
            sx={{ fontWeight: 700, display: 'inline-flex', gap: 0.5, alignItems: 'center', textDecoration: 'none' }}
          >
            {t('blog.readMore')}
            <KepIcon name="view" fontSize={18} />
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
