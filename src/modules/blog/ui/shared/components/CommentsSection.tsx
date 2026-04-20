import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Box,
  Divider,
  Drawer,
  Paper,
  Stack,
  TextField,
  Typography,
  drawerClasses,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import { BlogComment } from 'modules/blog/domain/entities/blog.entity';

interface CommentsSectionProps {
  comments?: BlogComment[];
  isLoading?: boolean;
  onLike: (commentId: number) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onSubmit: (body: string) => Promise<void>;
  isDrawer?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const CommentsSection = ({
  comments,
  isLoading,
  onLike,
  onDelete,
  onSubmit,
  isDrawer = false,
  open = false,
  onClose,
}: CommentsSectionProps) => {
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

  const commentsContent = (
    <Stack direction="column" spacing={4}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography variant="h6" fontWeight={700}>
          {t('blog.commentsWithCount', { count: comments?.length ?? 0 })}
        </Typography>

        {isDrawer ? (
          <Button color="neutral" shape="circle" onClick={onClose}>
            <IconifyIcon icon="material-symbols:close-rounded" fontSize={22} />
          </Button>
        ) : null}
      </Stack>

      {showEmptyState ? (
        <Typography variant="body2" color="text.secondary">
          {t('blog.emptyComments.subtitle')}
        </Typography>
      ) : null}

      <Stack direction="column" divider={<Divider />}>
        {sortedComments.map((comment) => (
          <Box key={comment.id} sx={{ py: 2.5 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={comment.userAvatar}
                    alt={comment.username}
                    sx={{ width: 40, height: 40 }}
                  />

                  <Stack spacing={0.25}>
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

                <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Button
                    size="small"
                    color="neutral"
                    onClick={() => onLike(comment.id)}
                    startIcon={<KepIcon name="like" fontSize={16} />}
                  >
                    {comment.likes || t('blog.actions.like')}
                  </Button>

                  {currentUser?.isSuperuser ? (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDelete(comment.id)}
                    >
                      {t('blog.actions.delete')}
                    </Button>
                  ) : null}
                </Stack>
              </Stack>

              <Typography
                dangerouslySetInnerHTML={{ __html: comment.body }}
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  '& p': {
                    my: 0,
                  },
                }}
              />
            </Stack>
          </Box>
        ))}
      </Stack>

      {currentUser ? (
        <Paper background={1} elevation={0} sx={{ p: 3, borderRadius: 4 }}>
          <Stack direction="column" spacing={2}>
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
          </Stack>
        </Paper>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('blog.loginToComment')}
        </Typography>
      )}
    </Stack>
  );

  if (isDrawer) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        sx={{
          [`& .${drawerClasses.paper}`]: {
            width: { xs: 1, md: 480 },
            overflowX: 'hidden',
            p: { xs: 3, md: 5 },
          },
        }}
      >
        {commentsContent}
      </Drawer>
    );
  }

  return <Box>{commentsContent}</Box>;
};

export default CommentsSection;
