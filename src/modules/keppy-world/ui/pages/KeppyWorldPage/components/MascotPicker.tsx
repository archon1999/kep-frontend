import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ButtonBase, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import {
  cosmeticColors,
  cosmeticIcons,
} from 'modules/keppy-world/ui/shared/helpers/mascot-accessories';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import type { WorldBootstrap } from '../../../../domain';
import { mascotOptions } from '../../../shared/helpers/mascot-visuals';
import { MascotAccessoryPreview } from './MascotAccessoryPreview';

type Props = {
  mascotId: string;
  cosmetic: string;
  cosmetics: WorldBootstrap['cosmetics'];
  disabled: boolean;
  onMascot: (id: string) => void;
  onCosmetic: (id: string) => void;
};
const previewViews = [
  { id: 'front', yaw: 0, icon: 'mdi:account-outline' },
  { id: 'side', yaw: Math.PI / 2, icon: 'mdi:rotate-right' },
  { id: 'back', yaw: Math.PI, icon: 'mdi:rotate-3d-variant' },
] as const;
const MascotPicker = ({ mascotId, cosmetic, cosmetics, disabled, onMascot, onCosmetic }: Props) => {
  const { t } = useTranslation();
  const [view, setView] = useState<(typeof previewViews)[number]['id']>('front');
  const selected = mascotOptions.find((mascot) => mascot.id === mascotId) ?? mascotOptions[0];
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch">
        <Box
          sx={{
            width: { xs: 1, sm: 176 },
            flexShrink: 0,
            bgcolor: 'background.elevation1',
            borderRadius: 2.5,
            overflow: 'hidden',
          }}
        >
          <Box
            role="img"
            aria-label={`${selected.name} · ${t(`keppyWorld.cosmetics.${cosmetic}`)}`}
            sx={{ height: 170, width: 1 }}
          >
            <MascotAccessoryPreview
              mascotId={mascotId}
              cosmetic={cosmetic}
              yaw={previewViews.find((item) => item.id === view)?.yaw}
            />
          </Box>
          <Stack direction="row" justifyContent="center" spacing={0.25} sx={{ pb: 0.5 }}>
            {previewViews.map((item) => (
              <Tooltip
                key={item.id}
                title={t(`keppyWorld.views.${item.id}`)}
                slotProps={{ popper: { disablePortal: true } }}
              >
                <IconButton
                  aria-label={t(`keppyWorld.views.${item.id}`)}
                  aria-pressed={view === item.id}
                  onClick={() => setView(item.id)}
                  size="small"
                  sx={{
                    color: view === item.id ? 'primary.main' : 'text.secondary',
                    bgcolor: view === item.id ? 'primary.lighter' : 'transparent',
                    borderRadius: 1.25,
                  }}
                >
                  <IconifyIcon icon={item.icon} width={19} />
                </IconButton>
              </Tooltip>
            ))}
          </Stack>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap={1} mb={1.25}>
            <Typography fontWeight={600} fontSize={15}>
              {selected.name}
            </Typography>
            <IconifyIcon icon="mdi:check-circle" width={15} sx={{ color: 'primary.main' }} />
          </Stack>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0.5 }}>
            {mascotOptions.map((mascot) => (
              <Tooltip
                key={mascot.id}
                title={mascot.name}
                slotProps={{ popper: { disablePortal: true } }}
              >
                <Box component="span" sx={{ display: 'flex', minWidth: 0 }}>
                  <ButtonBase
                    disabled={disabled}
                    aria-label={mascot.name}
                    aria-pressed={mascot.id === mascotId}
                    onClick={() => onMascot(mascot.id)}
                    sx={{
                      width: 1,
                      minWidth: 0,
                      minHeight: 64,
                      p: 0.5,
                      borderRadius: 2,
                      bgcolor: mascot.id === mascotId ? 'primary.lighter' : 'transparent',
                      '&:hover': { bgcolor: 'action.hover' },
                      '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' },
                    }}
                  >
                    <Box
                      component="img"
                      src={mascot.image}
                      alt=""
                      sx={{ width: 1, height: 59, objectFit: 'contain' }}
                    />
                  </ButtonBase>
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Stack>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2">{t('keppyWorld.accessories')}</Typography>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(4, minmax(0, 1fr))',
              sm: 'repeat(6, minmax(0, 1fr))',
            },
            gap: 0.75,
          }}
        >
          {cosmetics.map((item) => (
            <Tooltip
              slotProps={{ popper: { disablePortal: true } }}
              key={item.id}
              title={
                item.unlocked
                  ? t(`keppyWorld.cosmetics.${item.id}`)
                  : t('keppyWorld.level', { count: item.level })
              }
            >
              <Box component="span" sx={{ display: 'flex' }}>
                <ButtonBase
                  disabled={disabled || !item.unlocked}
                  aria-label={`${t(`keppyWorld.cosmetics.${item.id}`)}${!item.unlocked ? ` · ${t('keppyWorld.level', { count: item.level })}` : ''}`}
                  aria-pressed={cosmetic === item.id}
                  onClick={() => {
                    if (!disabled && item.unlocked) onCosmetic(item.id);
                  }}
                  sx={{
                    width: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    py: 1.2,
                    px: 0.25,
                    gap: 0.65,
                    borderRadius: 2,
                    bgcolor: cosmetic === item.id ? 'primary.lighter' : 'background.elevation1',
                    color: cosmetic === item.id ? 'primary.main' : 'text.secondary',
                    '&:hover': { bgcolor: 'action.selected' },
                    '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' },
                  }}
                >
                  <IconifyIcon
                    icon={cosmeticIcons[item.id] ?? 'mdi:star-outline'}
                    width={25}
                    sx={{ color: item.unlocked ? cosmeticColors[item.id] : 'text.disabled' }}
                  />
                  <Typography
                    sx={{
                      fontSize: 11,
                      lineHeight: 1.25,
                      minHeight: 28,
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'center',
                      fontWeight: cosmetic === item.id ? 600 : 500,
                    }}
                  >
                    {t(`keppyWorld.cosmetics.${item.id}`)}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={0.4}
                    sx={{ minHeight: 14, color: item.unlocked ? 'primary.main' : 'text.disabled' }}
                  >
                    {!item.unlocked && <IconifyIcon icon="mdi:lock-outline" width={11} />}
                    {cosmetic === item.id && <IconifyIcon icon="mdi:check" width={12} />}
                    <Typography sx={{ fontSize: 10, lineHeight: 1.2 }}>
                      {!item.unlocked
                        ? t('keppyWorld.level', { count: item.level })
                        : cosmetic === item.id
                          ? t('keppyWorld.equipped')
                          : '\u00a0'}
                    </Typography>
                  </Stack>
                </ButtonBase>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Box>
    </Stack>
  );
};
export default MascotPicker;
