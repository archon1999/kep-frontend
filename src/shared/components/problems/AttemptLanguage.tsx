import { Box, Button } from '@mui/material';
import { memo, useMemo } from 'react';

interface AttemptLanguageProps {
  lang: string;
  langFull?: string;
  size?: number;
  clickable?: boolean;
}

const AttemptLanguage = ({ lang, langFull, size = 36, clickable = false, ...rest }: AttemptLanguageProps) => {
  const label = lang?.toUpperCase() || '--';
  const imgSrc = useMemo(
    () => new URL(`../../assets/images/languages/${lang || 'text'}.svg`, import.meta.url).toString(),
    [lang],
  );

  if (clickable) {
    return (
      <Button
        variant="outlined"
        color="primary"
        startIcon={
          <img
            src={imgSrc}
            alt={langFull || label}
            width={size / 1.8}
            height={size / 1.8}
            style={{ borderRadius: 4 }}
          />
        }
        sx={{ textTransform: 'none', borderRadius: 999, justifyContent: 'flex-start' }}
        {...rest}
      >
        {langFull ?? label}
      </Button>
    );
  }

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={langFull || label}
      title={langFull || label}
      width={size}
      height={size}
      sx={{ borderRadius: '6px', objectFit: 'cover' }}
      {...rest}
    />
  );
};

export default memo(AttemptLanguage);
