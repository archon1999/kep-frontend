import { useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Divider, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import KepIcon from 'shared/components/base/KepIcon';
import { BlogComment } from '../../domain/entities/blog.entity';

interface CommentsSectionProps {
  comments?: BlogComment[];
  isLoading?: boolean;
  onLike: (commentId: number) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onSubmit: (body: string) => Promise<void>;
}

const CommentsSection = ({ comments, isLoading, onLike, onDelete, onSubmit }: CommentsSectionProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [body, setBody] = useState('');

  const showEmptyState = !isLoading && (!comments || comments.length === 0);

  const sortedComments = useMemo(() => comments ?? [], [comments]);

  const handleSubmit = async () => {
    if (!body.trim()) return;
    await onSubmit(body.trim());
    setBody('');
  };

  return (
    <Stack direction="column" spacing={2.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <KepIcon name="comment" fontSize={22} />
        <Typography variant="h6" fontWeight={800}>
          {t('blog.commentsWithCount', { count: comments?.length ?? 0 })}
        </Typography>
      </Stack>

      {showEmptyState ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={700}>
              {t('blog.emptyComments.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('blog.emptyComments.subtitle')}
            </Typography>
          </CardContent>
        </Card>
      ) : null}

      <Stack direction="column" spacing={1.5}>
        {sortedComments.map((comment) => (
          <Card key={comment.id} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    component="img"
                    src={comment.userAvatar}
                    alt={comment.username}
                    sx={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <Stack direction="column" spacing={0.25}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {comment.username}
                    </Typography>
                    {comment.created ? (
                      <Typography variant="caption" color="text.secondary">
                        {comment.created}
                      </Typography>
                    ) : null}
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onLike(comment.id)}
                    startIcon={<KepIcon name="like" fontSize={18} />}
                  >
                    {comment.likes || t('blog.actions.like')}
                  </Button>
                  {currentUser?.isSuperuser ? (
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => onDelete(comment.id)}
                      startIcon={<KepIcon name="close" fontSize={18} />}
                    >
                      {t('blog.actions.delete')}
                    </Button>
                  ) : null}
                </Stack>
              </Stack>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Typography dangerouslySetInnerHTML={{__html: comment.body}} variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {currentUser ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              {t('blog.addCommentTitle')}
            </Typography>
            <TextField
              multiline
              minRows={3}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={t('blog.addCommentPlaceholder')}
            />
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" onClick={handleSubmit} disabled={!body.trim()}>
                {t('blog.actions.submit')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('blog.loginToComment')}
        </Typography>
      )}
    </Stack>
  );
};

export default CommentsSection;
