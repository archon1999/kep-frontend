import { Box, Stack, StackProps, Typography } from '@mui/material';
import { useMemo } from 'react';

const ratingImages = import.meta.glob('../../assets/images/contests/ratings/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const buildImageMap = () =>
  Object.entries(ratingImages).reduce<Record<string, string>>((acc, [path, value]) => {
    const match = path.split('/').pop();
    if (!match) {
      return acc;
    }

    const key = match.replace(/\.png$/i, '');
    acc[key] = value;

    return acc;
  }, {});

const cachedMap = buildImageMap();

interface ContestsRatingChipProps extends Omit<StackProps, 'title'> {
  title?: string | null;
  imgSize?: number;
  withTitle?: boolean;
}

const ContestsRatingChip = ({ title, imgSize = 24, withTitle = false, ...stackProps }: ContestsRatingChipProps) => {
  const lowerCaseTitle = title?.toLowerCase();

  const imageSrc = useMemo(() => {
    if (!lowerCaseTitle) {
      return null;
    }

    return cachedMap[lowerCaseTitle] ?? null;
  }, [lowerCaseTitle]);

  if (!imageSrc && !withTitle) {
    return null;
  }

  return (
    <Stack direction="row" spacing={0.75} alignItems="center" {...stackProps}>
      {imageSrc ? (
        <Box
          component="img"
          src={imageSrc}
          alt={title ?? 'Contests rating'}
          sx={{ width: imgSize, height: imgSize, borderRadius: '50%' }}
        />
      ) : null}
      {withTitle && title ? (
        <Typography variant="caption" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
          {title}
        </Typography>
      ) : null}
    </Stack>
  );
};

export default ContestsRatingChip;
