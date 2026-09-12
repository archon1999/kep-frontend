import { Box, Chip, ChipProps } from '@mui/material';
import { getChallengesRatingImageSrc, normalizeChallengesRatingTitle } from './challengesRating';

interface ChallengesRatingChipProps extends Omit<ChipProps, 'label' | 'title'> {
  title?: string | null;
  rating?: number;
}

const ChallengesRatingChip = ({
  title,
  size = 'small',
  rating,
  sx = [],
  ...chipProps
}: ChallengesRatingChipProps) => {
  if (!title) {
    return null;
  }

  const imageSrc = getChallengesRatingImageSrc(title);
  const normalizedTitle = normalizeChallengesRatingTitle(title);

  return (
    <Chip
      label={
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          {imageSrc ? (
            <Box
              component="img"
              src={imageSrc}
              alt={normalizedTitle}
              sx={{
                display: 'block',
                height: size === 'small' ? 15 : 18,
                width: 'auto',
                maxWidth: size === 'small' ? 37 : 44,
                objectFit: 'contain',
                flexShrink: 0,
              }}
            />
          ) : (
            normalizedTitle
          )}
          {rating !== undefined ? <Box component="span">{rating}</Box> : null}
        </Box>
      }
      size={size}
      variant="soft"
      {...chipProps}
      sx={[
        {
          bgcolor: 'transparent',
          color: 'text.primary',
          fontWeight: 600,
          '& .MuiChip-label': { px: 0.5 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
};

export default ChallengesRatingChip;
