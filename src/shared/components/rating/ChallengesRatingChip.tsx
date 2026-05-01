import { Chip, ChipProps, useTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';

const rankColorMap = {
  R4: 'neutral',
  R3: 'green',
  R2: 'cyan',
  R1: 'blue',
  CM: 'purple',
  M: 'yellow',
  IM: 'orange',
  GM: 'red',
  SGM: 'black',
} as const;

const getChipStyles = (color: string, theme: Theme) => {
  switch (color) {
    case 'green':
      return { bgcolor: theme.palette.success.main, color: theme.palette.secondary.contrastText };
    case 'cyan':
      return { bgcolor: theme.palette.info.main, color: theme.palette.secondary.contrastText };
    case 'blue':
      return { bgcolor: theme.palette.primary.main, color: theme.palette.secondary.contrastText };
    case 'purple':
      return { bgcolor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText };
    case 'yellow':
      return { bgcolor: theme.palette.warning.main, color: theme.palette.warning.contrastText };
    case 'orange':
      return { bgcolor: theme.palette.warning.main, color: theme.palette.secondary.contrastText };
    case 'red':
      return { bgcolor: theme.palette.error.main, color: theme.palette.secondary.contrastText };
    case 'black':
      return { bgcolor: theme.palette.common.black, color: theme.palette.common.white };
    case 'neutral':
    default:
      return { bgcolor: theme.palette.grey[200], color: theme.palette.text.primary };
  }
};

interface ChallengesRatingChipProps extends Omit<ChipProps, 'label' | 'title'> {
  title?: string | null;
  rating?: number;
}

const ChallengesRatingChip = ({ title, size = 'small', rating, ...chipProps }: ChallengesRatingChipProps) => {
  const theme = useTheme();

  if (!title) {
    return null;
  }

  const colorKey = rankColorMap[title as keyof typeof rankColorMap] ?? 'neutral';
  const { bgcolor, color } = getChipStyles(colorKey, theme);

  return (
    <Chip
      label={rating ?? title}
      size={size}
      variant="soft"
      sx={{
        textTransform: 'uppercase',
        fontWeight: 600,
        bgcolor,
        color,
      }}
      {...chipProps}
    />
  );
};

export default ChallengesRatingChip;
