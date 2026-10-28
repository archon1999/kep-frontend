import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Skeleton,
  Stack,
  TextField,
  Typography,
  drawerClasses,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { BlogComment } from 'modules/blog/domain/entities/blog.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import MixedText from 'shared/components/common/MixedText';
import { useLoginHref, useLoginRedirect } from 'shared/lib/authRedirect';
import { toast } from 'sonner';

interface CommentsSectionProps {
  comments?: BlogComment[];
  isLoading?: boolean;
  isSubmitting?: boolean;
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
  isSubmitting = false,
  onLike,
  onDelete,
  onSubmit,
  isDrawer = false,
  open = false,
  onClose,
}: CommentsSectionProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const loginHref = useLoginHref();
  const [body, setBody] = useState('');

  const showEmptyState = !isLoading && (!comments || comments.length === 0);

  const sortedComments = useMemo(() => comments ?? [], [comments]);

  const handleSubmit = async () => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    if (!body.trim()) return;
    try {
      await onSubmit(body.trim());
      setBody('');
    } catch {
      toast.error(t('common.loadFailed'));
    }
  };

  const handleLike = async (commentId: number) => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    try {
      await onLike(commentId);
    } catch {
      toast.error(t('common.loadFailed'));
    }
  };

  const commentsContent = (
    <Stack direction="column" spacing={2.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography component="h2" variant="h5" sx={{ fontWeight: 500 }}>
          <MixedText>{t('blog.commentsWithCount', { count: comments?.length ?? 0 })}</MixedText>
        </Typography>

        {isDrawer ? (
          <Button color="neutral" shape="circle" onClick={onClose} aria-label={t('common.close')}>
            <IconifyIcon icon="material-symbols:close-rounded" fontSize={22} />
          </Button>
        ) : null}
      </Stack>

      {isLoading && (
        <Stack gap={1}>
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} height={60} />
          ))}
        </Stack>
      )}
      {showEmptyState ? (
        <Typography variant="body2" color="text.secondary">
          {t('blog.emptyComments.subtitle')}
        </Typography>
      ) : null}

      <Stack direction="column" divider={<Divider />}>
        {sortedComments.map((comment) => (
          <Box key={comment.id} sx={{ py: 2.5 }}>
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                  <Avatar
                    src={comment.userAvatar}
                    alt={comment.username}
                    sx={{ width: 32, height: 32 }}
                  />

                  <Stack spacing={0.25}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ overflowWrap: 'anywhere' }}
                    >
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
                    onClick={() => handleLike(comment.id)}
                    startIcon={<KepIcon name="like" fontSize={16} />}
                  >
                    {comment.likes || t('blog.actions.like')}
                  </Button>

                  {currentUser?.isSuperuser ? (
                    <Button size="small" color="error" onClick={() => onDelete(comment.id)}>
                      {t('blog.actions.delete')}
                    </Button>
                  ) : null}
                </Stack>
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  '& p': {
                    my: 0,
                  },
                }}
              >
                {comment.body}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>

      {currentUser ? (
        <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Stack direction="column" spacing={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              {t('blog.addCommentTitle')}
            </Typography>

            <TextField
              multiline
              label={t('blog.addCommentTitle')}
              minRows={3}
              disabled={isSubmitting}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={t('blog.addCommentPlaceholder')}
            />

            <Stack direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!body.trim() || isSubmitting}
              >
                {t('blog.actions.submit')}
              </Button>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
          <Typography variant="body2" color="text.secondary">
            {t('blog.loginToComment')}
          </Typography>
          <Button component={RouterLink} to={loginHref} variant="outlined" size="small">
            {t('auth.login')}
          </Button>
        </Stack>
      )}
    </Stack>
  );

  if (isDrawer) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-label': t('blog.commentsWithCount', { count: comments?.length ?? 0 }),
          },
        }}
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
