import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { alpha } from '@mui/material/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { DuelPreset, DuelTypeInfo } from '../../domain/index.ts';

type Props = {
  presets: DuelPreset[];
  duelTypes: DuelTypeInfo[];
  selectedPresetId: string;
  selectedTypeId: string;
  disabled?: boolean;
  onPresetChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSubmit: () => void;
};

const DifficultyStars = ({ difficulty = 0 }: { difficulty?: number }) => (
  <Stack direction="row" spacing={0.1} alignItems="center" justifyContent="flex-end">
    {Array.from({ length: 5 }).map((_, index) => {
      const filled = index < difficulty;
      return (
        <IconifyIcon
          key={index}
          icon={filled ? 'mdi:star' : 'mdi:star-outline'}
          sx={{
            fontSize: 17,
            color: filled ? 'warning.main' : 'text.disabled',
          }}
        />
      );
    })}
  </Stack>
);

const PresetOptionContent = ({
  preset,
  compact = false,
}: {
  preset: DuelPreset;
  compact?: boolean;
}) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    spacing={2}
    width="100%"
    sx={{ minWidth: 0 }}
  >
    <Stack spacing={compact ? 0.25 : 0.45} sx={{ minWidth: 0, flex: 1 }}>
      <Typography variant={compact ? 'subtitle2' : 'subtitle1'} fontWeight={800} noWrap>
        {preset.title}
      </Typography>
      <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" rowGap={0.5}>
        {preset.duration ? (
          <Chip
            size="small"
            variant="outlined"
            color="primary"
            label={preset.duration}
            sx={{ fontWeight: 700 }}
          />
        ) : null}
        {typeof preset.problemsCount === 'number' ? (
          <Chip size="small" variant="outlined" label={`${preset.problemsCount}P`} sx={{ fontWeight: 700 }} />
        ) : null}
      </Stack>
      {!compact && preset.description ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {preset.description}
        </Typography>
      ) : null}
    </Stack>

    <Stack spacing={0.35} minWidth={compact ? 84 : 110} alignItems="flex-end">
      <DifficultyStars difficulty={preset.difficulty} />
      <Typography variant="caption" color="text.secondary" fontWeight={700} noWrap>
        {preset.difficultyDisplay}
      </Typography>
    </Stack>
  </Stack>
);

const DuelTypeOptionContent = ({
  duelType,
  compact = false,
}: {
  duelType: DuelTypeInfo;
  compact?: boolean;
}) => (
  <Stack spacing={compact ? 0.25 : 0.5} sx={{ minWidth: 0 }}>
    <Typography variant={compact ? 'subtitle2' : 'subtitle1'} fontWeight={800} noWrap>
      {duelType.title}
    </Typography>
    {duelType.description ? (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={
          compact
            ? undefined
            : {
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
        }
      >
        {duelType.description}
      </Typography>
    ) : null}
  </Stack>
);

const DuelCallComposerCard = ({
  presets,
  duelTypes,
  selectedPresetId,
  selectedTypeId,
  disabled,
  onPresetChange,
  onTypeChange,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const selectedPreset = useMemo(
    () => presets.find((preset) => String(preset.id ?? '') === selectedPresetId),
    [presets, selectedPresetId],
  );
  const selectedType = useMemo(
    () => duelTypes.find((duelType) => String(duelType.id ?? '') === selectedTypeId),
    [duelTypes, selectedTypeId],
  );

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        height: '100%',
        borderRadius: 4,
        borderColor: alpha(theme.palette.primary.main, 0.18),
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.background.paper, 0.98)})`,
      })}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2.5}>
          <Stack spacing={0.75}>
            <Typography variant="h6" fontWeight={900}>
              {t('duels.createCallTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('duels.createCallDescription')}
            </Typography>
          </Stack>

          <FormControl fullWidth>
            <InputLabel id="duel-preset-select-label">{t('duels.preset')}</InputLabel>
            <Select
              labelId="duel-preset-select-label"
              value={selectedPresetId}
              onChange={(event) => onPresetChange(String(event.target.value))}
              input={<OutlinedInput label={t('duels.preset')} />}
              renderValue={(value) => {
                const preset = presets.find((item) => String(item.id ?? '') === String(value));
                if (!preset) {
                  return <Typography color="text.secondary">{t('duels.selectPreset')}</Typography>;
                }
                return <PresetOptionContent preset={preset} compact />;
              }}
              sx={{
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
            >
              {presets.map((preset) => (
                <MenuItem key={preset.id} value={String(preset.id ?? '')} sx={{ py: 1.25 }}>
                  <PresetOptionContent preset={preset} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="duel-type-select-label">{t('duels.duelType')}</InputLabel>
            <Select
              labelId="duel-type-select-label"
              value={selectedTypeId}
              onChange={(event) => onTypeChange(String(event.target.value))}
              input={<OutlinedInput label={t('duels.duelType')} />}
              renderValue={(value) => {
                const duelType = duelTypes.find((item) => String(item.id ?? '') === String(value));
                if (!duelType) {
                  return <Typography color="text.secondary">{t('duels.selectDuelType')}</Typography>;
                }
                return <DuelTypeOptionContent duelType={duelType} compact />;
              }}
              sx={{
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
            >
              {duelTypes.map((duelType) => (
                <MenuItem key={duelType.id} value={String(duelType.id ?? '')} sx={{ py: 1.25 }}>
                  <DuelTypeOptionContent duelType={duelType} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(selectedPreset || selectedType) ? (
            <Box
              sx={(theme) => ({
                borderRadius: 3,
                p: 1.75,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.12),
              })}
            >
              <Stack spacing={1}>
                {selectedPreset ? (
                  <>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Stack spacing={0.25}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('duels.presetDetails')}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={800}>
                          {selectedPreset.title}
                        </Typography>
                      </Stack>
                      <DifficultyStars difficulty={selectedPreset.difficulty} />
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedPreset.duration ? (
                        <Chip size="small" color="primary" label={selectedPreset.duration} />
                      ) : null}
                      {typeof selectedPreset.problemsCount === 'number' ? (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={t('duels.presetProblemsCount', { count: selectedPreset.problemsCount })}
                        />
                      ) : null}
                      {selectedPreset.difficultyDisplay ? (
                        <Chip size="small" variant="outlined" label={selectedPreset.difficultyDisplay} />
                      ) : null}
                    </Stack>
                  </>
                ) : null}

                {selectedType ? (
                  <Stack spacing={0.25}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('duels.duelType')}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {selectedType.title}
                    </Typography>
                    {selectedType.description ? (
                      <Typography variant="body2" color="text.secondary">
                        {selectedType.description}
                      </Typography>
                    ) : null}
                  </Stack>
                ) : null}
              </Stack>
            </Box>
          ) : null}

          <Button
            variant="contained"
            size="large"
            onClick={onSubmit}
            disabled={disabled || !selectedPresetId || !selectedTypeId}
            startIcon={<IconifyIcon icon="mdi:sword-cross" width={18} height={18} />}
            sx={{ borderRadius: 999, alignSelf: 'flex-start', px: 2.5 }}
          >
            {t('duels.createDuel')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelCallComposerCard;
