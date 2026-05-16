import { useEffect, useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { homeQueries } from 'modules/home/application/queries';
import type { HomeSystemUpdate } from 'modules/home/domain/entities/home.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface SystemUpdateLikeButtonProps {
  update: Pick<HomeSystemUpdate, 'id' | 'likesCount' | 'isLiked'>;
  onChanged?: () => void;
}

const SystemUpdateLikeButton = ({ update, onChanged }: SystemUpdateLikeButtonProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [likesCount, setLikesCount] = useState(update.likesCount);
  const [isLiked, setIsLiked] = useState(update.isLiked);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLikesCount(update.likesCount);
    setIsLiked(update.isLiked);
  }, [update.id, update.isLiked, update.likesCount]);

  const handleLike = async () => {
    if (!currentUser || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const result = await homeQueries.repository.likeSystemUpdate(update.id);
      setLikesCount(result.likesCount);
      setIsLiked(result.isLiked);
      onChanged?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tooltip title={currentUser ? t('homePage.updates.like') : t('homePage.updates.loginToLike')}>
      <span>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={handleLike}
          disabled={!currentUser || isSubmitting}
          startIcon={<IconifyIcon icon={isLiked ? 'mdi:heart' : 'mdi:heart-outline'} sx={{ fontSize: 18 }} />}
          sx={{
            minWidth: 0,
            px: 1.25,
            fontWeight: 800,
            whiteSpace: 'nowrap',
          }}
        >
          {t('homePage.updates.likes', { count: likesCount })}
        </Button>
      </span>
    </Tooltip>
  );
};

export default SystemUpdateLikeButton;
