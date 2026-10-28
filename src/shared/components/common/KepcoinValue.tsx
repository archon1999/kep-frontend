import { Box, Stack, StackProps, Typography, TypographyProps } from '@mui/material';
import kepcoinImage from 'shared/assets/images/icons/kepcoin-icon.webp';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';

interface KepcoinValueProps extends StackProps {
  value?: number | string | null;
  label?: string;
  iconSize?: number;
  textVariant?: TypographyProps['variant'];
  fontWeight?: TypographyProps['fontWeight'];
  color?: TypographyProps['color'];
  animateValue?: boolean;
}

const KepcoinValue = ({
  value,
  label,
  iconSize = 20,
  textVariant = 'body2',
  fontWeight = 700,
  color = 'text.primary',
  animateValue = false,
  direction = 'row',
  spacing = 0.75,
  alignItems = 'center',
  ...stackProps
}: KepcoinValueProps) => {
  const displayValue = label ?? value ?? '--';

  return (
    <Stack direction={direction} spacing={spacing} alignItems={alignItems} {...stackProps}>
      <Box
        component="img"
        src={kepcoinImage}
        alt="Kepcoin"
        width={iconSize}
        height={iconSize}
        decoding="async"
        sx={{ width: iconSize, height: iconSize }}
      />
      <Typography variant={textVariant} fontWeight={fontWeight} color={color}>
        {animateValue ? <ScrambleText>{String(displayValue)}</ScrambleText> : displayValue}
      </Typography>
    </Stack>
  );
};

export default KepcoinValue;
