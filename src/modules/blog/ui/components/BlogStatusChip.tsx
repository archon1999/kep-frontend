import { useTranslation } from 'react-i18next';
import { Chip, ChipProps } from '@mui/material';
import { BlogStatus } from '../../domain/entities/blog.entity';

interface BlogStatusChipProps {
  status: BlogStatus;
  size?: ChipProps['size'];
}

const statusColorMap: Record<BlogStatus, ChipProps['color']> = {
  [BlogStatus.Draft]: 'default',
  [BlogStatus.Published]: 'success',
  [BlogStatus.Pending]: 'warning',
};

const statusTranslationMap: Record<BlogStatus, string> = {
  [BlogStatus.Draft]: 'blog.status.draft',
  [BlogStatus.Published]: 'blog.status.published',
  [BlogStatus.Pending]: 'blog.status.pending',
};

const BlogStatusChip = ({ status, size = 'small' }: BlogStatusChipProps) => {
  const { t } = useTranslation();

  return (
    <Chip
      color={statusColorMap[status] ?? 'default'}
      label={t(statusTranslationMap[status] ?? 'blog.status.draft')}
      size={size}
      variant="outlined"
      sx={{ borderRadius: 2 }}
    />
  );
};

export default BlogStatusChip;
