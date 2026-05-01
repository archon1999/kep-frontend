import { Box, Stack, StackProps, Typography, TypographyProps } from '@mui/material';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';

interface KepcoinValueProps extends StackProps {
  value?: number | string | null;
  label?: string;
  iconSize?: number;
  textVariant?: TypographyProps['variant'];
  fontWeight?: TypographyProps['fontWeight'];
  color?: TypographyProps['color'];
}

const KepcoinValue = ({
  value,
  label,
  iconSize = 20,
  textVariant = 'body2',
  fontWeight = 700,
  color = 'text.primary',
  direction = 'row',
  spacing = 0.75,
  alignItems = 'center',
  ...stackProps
}: KepcoinValueProps) => {
  const displayValue = label ?? (value ?? '--');

  return (
    <Stack direction={direction} spacing={spacing} alignItems={alignItems} {...stackProps}>
      <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: iconSize, height: iconSize }} />
      <Typography variant={textVariant} fontWeight={fontWeight} color={color}>
        {displayValue}
      </Typography>
    </Stack>
  );
};

export default KepcoinValue;
