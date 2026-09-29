import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const levelTones = [
  { light: ['#286298', '#eaf3fb', '#cdddee'], dark: ['#acd1ff', '#1c344d', '#355778'] },
  { light: ['#20745e', '#e6f4ee', '#c2dfd3'], dark: ['#91ddbd', '#193a32', '#356054'] },
  { light: ['#685193', '#f0eaf8', '#ddd2ed'], dark: ['#c9b2f1', '#312740', '#59436e'] },
  { light: ['#946623', '#fbf1dc', '#efddb4'], dark: ['#efd195', '#443620', '#695332'] },
  { light: ['#9b506c', '#f8e9ef', '#edd0dc'], dark: ['#edabc8', '#402734', '#69465a'] },
] as const;

export default function WorldLevelBadge({ level }: { level: number }) {
  const { t } = useTranslation();
  const tone = levelTones[level >= 15 ? 4 : level >= 10 ? 3 : level >= 7 ? 2 : level >= 4 ? 1 : 0];
  return (
    <Box
      component="span"
      role="img"
      aria-label={t('keppyWorld.level', { count: level })}
      title={t('keppyWorld.level', { count: level })}
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        gap: 0.25,
        minWidth: 30,
        px: 0.6,
        height: 16,
        border: '1px solid',
        borderRadius: 1,
        fontSize: 10,
        lineHeight: 1,
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
        color: tone.light[0],
        bgcolor: tone.light[1],
        borderColor: tone.light[2],
        ...theme.applyStyles('dark', {
          color: tone.dark[0],
          bgcolor: tone.dark[1],
          borderColor: tone.dark[2],
        }),
      })}
    >
      <IconifyIcon
        icon={{
          width: 24,
          height: 24,
          body: '<path fill="currentColor" d="M7.41,18.41L6,17L12,11L18,17L16.59,18.41L12,13.83L7.41,18.41M7.41,12.41L6,11L12,5L18,11L16.59,12.41L12,7.83L7.41,12.41Z"/>',
        }}
        width={11}
        aria-hidden="true"
      />
      {level}
    </Box>
  );
}
