import { Box, BoxProps } from '@mui/material';
import { memo } from 'react';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import formatCountryFlag from 'shared/utils/formatCountryFlag';

interface CountryFlagIconProps {
  code?: string;
  size?: number;
  sx?: BoxProps['sx'];
}

const FLAG_ASPECT_RATIO = 3 / 4;

const sanitizeCode = (code?: string) => code?.trim() ?? '';

const extractAlpha2Code = (code?: string) => {
  const sanitized = sanitizeCode(code);
  if (!sanitized) return undefined;

  const withoutFlagPrefix = sanitized.replace(/^flag:/i, '');
  const lettersOnly = withoutFlagPrefix.replace(/[^a-z]/gi, '');

  if (lettersOnly.length < 2) return undefined;

  return `${lettersOnly[0]}${lettersOnly[1]}`.toUpperCase();
};

const buildFlagIconName = (code?: string) => {
  const alpha2Code = extractAlpha2Code(code);
  if (!alpha2Code) return undefined;

  return `flag:${alpha2Code.toLowerCase()}-4x3`;
};

const CountryFlagIcon = ({ code, size = 18, sx }: CountryFlagIconProps) => {
  const iconName = buildFlagIconName(code);
  const alpha2Code = extractAlpha2Code(code);

  if (!iconName && !alpha2Code) return null;

  if (iconName) {
    return (
      <IconifyIcon
        icon={iconName}
        width={size}
        height={size * FLAG_ASPECT_RATIO}
        sx={[
          {
            borderRadius: 0.5,
            flexShrink: 0,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      />
    );
  }

  return (
    <Box
      component="span"
      sx={[
        {
          fontSize: size * 0.9,
          lineHeight: 1,
          flexShrink: 0,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {formatCountryFlag(alpha2Code)}
    </Box>
  );
};

export default memo(CountryFlagIcon);
