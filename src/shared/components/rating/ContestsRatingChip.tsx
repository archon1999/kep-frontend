import { Box, Stack, StackProps, Tooltip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { getContestsRatingImageSrc } from './contestsRating';

interface ContestsRatingChipProps extends Omit<StackProps, 'title'> {
  title?: string | null;
  imgSize?: number;
  withTitle?: boolean;
}

const ContestsRatingChip = ({ title, imgSize = 24, withTitle = false, ...stackProps }: ContestsRatingChipProps) => {
  const imageSrc = useMemo(() => {
    return getContestsRatingImageSrc(title);
  }, [title]);

  if (!imageSrc && !withTitle) {
    return null;
  }

  const content = (
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

  return (
    <Tooltip title={title ?? ''} arrow>
      {content}
    </Tooltip>
  );
};

export default ContestsRatingChip;
