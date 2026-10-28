import { useTranslation } from 'react-i18next';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import {
  DuelPreset,
  DuelTypeInfo,
  formatDuelDuration,
  getDuelPresetCategoryTitle,
} from 'modules/duels/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';

type Props = {
  presets: DuelPreset[];
  duelTypes: DuelTypeInfo[];
  selectedPresetId: string;
  selectedTypeId: string;
  onPresetChange: (value: string) => void;
  onTypeChange: (value: string) => void;
};
const DuelCallComposerForm = ({
  presets,
  duelTypes,
  selectedPresetId,
  selectedTypeId,
  onPresetChange,
  onTypeChange,
}: Props) => {
  const { t } = useTranslation();
  const preset = presets.find((item) => String(item.id) === selectedPresetId);
  const type = duelTypes.find((item) => String(item.id) === selectedTypeId);
  return (
    <Stack gap={2.5}>
      <FormControl fullWidth>
        <InputLabel id="duel-preset-select-label">{t('duels.preset')}</InputLabel>
        <Select
          labelId="duel-preset-select-label"
          label={t('duels.preset')}
          value={preset ? selectedPresetId : ''}
          onChange={(e) => onPresetChange(String(e.target.value))}
          renderValue={() => preset?.title ?? t('duels.selectPreset')}
          MenuProps={{ PaperProps: { sx: { maxHeight: 420 } } }}
        >
          {presets.map((item) => (
            <MenuItem
              key={item.id}
              value={String(item.id ?? '')}
              sx={{ py: 1.5, whiteSpace: 'normal' }}
            >
              <Stack gap={0.5} sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {[
                    getDuelPresetCategoryTitle(item),
                    item.duration && formatDuelDuration(item.duration),
                    typeof item.problemsCount === 'number' &&
                      t('duels.presetProblemsCount', { count: item.problemsCount }),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="duel-type-select-label">{t('duels.duelType')}</InputLabel>
        <Select
          labelId="duel-type-select-label"
          label={t('duels.duelType')}
          value={type ? selectedTypeId : ''}
          onChange={(e) => onTypeChange(String(e.target.value))}
          renderValue={() => type?.title ?? t('duels.selectDuelType')}
        >
          {duelTypes.map((item) => (
            <MenuItem
              key={item.id}
              value={String(item.id ?? '')}
              sx={{ py: 1.5, whiteSpace: 'normal' }}
            >
              <Stack gap={0.5} sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600}>
                  {item.title}
                </Typography>
                {item.description && (
                  <Typography variant="caption" color="text.secondary">
                    {item.description}
                  </Typography>
                )}
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {preset && (
        <Box sx={{ pt: 2.5, borderTop: '1px solid var(--kep-line)' }}>
          <Stack direction="row" gap={2} justifyContent="space-between" alignItems="center">
            <Stack gap={0.75} sx={{ minWidth: 0 }}>
              <Typography variant="label" color="text.secondary">
                {t('duels.presetDetails')}
              </Typography>
              <Typography
                component="h3"
                sx={{
                  fontFamily: 'var(--kep-display-font)',
                  fontSize: 22,
                  fontWeight: 500,
                  overflowWrap: 'anywhere',
                }}
              >
                <MixedText>{preset.title ?? ''}</MixedText>
              </Typography>
            </Stack>
            <PatternArtwork
              kind="battles"
              sx={{ width: 88, opacity: 0.45, display: { xs: 'none', sm: 'block' } }}
            />
          </Stack>
          <Stack direction="row" gap={2.5} alignItems="center" flexWrap="wrap" sx={{ my: 1.5 }}>
            {preset.duration && (
              <Stack direction="row" gap={0.75} alignItems="center">
                <IconifyIcon
                  icon="mdi:clock-outline"
                  sx={{ fontSize: 18, color: 'primary.main' }}
                />
                <Typography variant="metric" sx={{ fontSize: 18 }}>
                  {formatDuelDuration(preset.duration)}
                </Typography>
              </Stack>
            )}
            {typeof preset.problemsCount === 'number' && (
              <Typography variant="body2" color="text.secondary">
                {t('duels.presetProblemsCount', { count: preset.problemsCount })}
              </Typography>
            )}
            {preset.difficultyDisplay && (
              <Typography variant="caption" color="text.secondary">
                {preset.difficultyDisplay}
              </Typography>
            )}
          </Stack>
          {preset.description && (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {preset.description}
            </Typography>
          )}
          {type?.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>
              {type.description}
            </Typography>
          )}
        </Box>
      )}
    </Stack>
  );
};
export default DuelCallComposerForm;
