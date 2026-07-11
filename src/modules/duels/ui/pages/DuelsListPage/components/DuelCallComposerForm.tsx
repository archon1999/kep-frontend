import { useTranslation } from 'react-i18next';
import {
  Chip,
  FilledInput,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import {
  DuelPreset,
  DuelTypeInfo,
  formatDuelDuration,
  getDuelPresetCategoryTitle,
} from 'modules/duels/domain/index.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';

type Props = {
  presets: DuelPreset[];
  duelTypes: DuelTypeInfo[];
  selectedPresetId: string;
  selectedTypeId: string;
  onPresetChange: (value: string) => void;
  onTypeChange: (value: string) => void;
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
}) => {
  const categoryTitle = getDuelPresetCategoryTitle(preset);

  return (
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
          {categoryTitle ? (
            <Chip size="small" color="secondary" label={categoryTitle} sx={{ fontWeight: 700 }} />
          ) : null}
          {preset.duration ? (
            <Chip
              size="small"
              variant="outlined"
              color="primary"
              label={formatDuelDuration(preset.duration)}
              sx={{ fontWeight: 700 }}
            />
          ) : null}
          {typeof preset.problemsCount === 'number' ? (
            <Chip
              size="small"
              variant="outlined"
              label={`${preset.problemsCount}P`}
              sx={{ fontWeight: 700 }}
            />
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
      </Stack>
    </Stack>
  );
};

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

const DuelCallComposerForm = ({
  presets,
  duelTypes,
  selectedPresetId,
  selectedTypeId,
  onPresetChange,
  onTypeChange,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2.5}>
      <FormControl fullWidth variant="filled">
        <InputLabel id="duel-preset-select-label">{t('duels.preset')}</InputLabel>
        <Select
          labelId="duel-preset-select-label"
          value={selectedPresetId}
          onChange={(event) => onPresetChange(String(event.target.value))}
          input={<FilledInput disableUnderline />}
          renderValue={(value) => {
            const preset = presets.find((item) => String(item.id ?? '') === String(value));
            if (!preset) {
              return <Typography color="text.secondary">{t('duels.selectPreset')}</Typography>;
            }
            return <PresetOptionContent preset={preset} compact />;
          }}
          sx={{
            borderRadius: 2,
            '& .MuiSelect-select': {
              pt: 3,
              pb: 1.25,
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

      <FormControl fullWidth variant="filled">
        <InputLabel id="duel-type-select-label">{t('duels.duelType')}</InputLabel>
        <Select
          labelId="duel-type-select-label"
          value={selectedTypeId}
          onChange={(event) => onTypeChange(String(event.target.value))}
          input={<FilledInput disableUnderline />}
          renderValue={(value) => {
            const duelType = duelTypes.find((item) => String(item.id ?? '') === String(value));
            if (!duelType) {
              return <Typography color="text.secondary">{t('duels.selectDuelType')}</Typography>;
            }
            return <DuelTypeOptionContent duelType={duelType} compact />;
          }}
          sx={{
            borderRadius: 2,
            '& .MuiSelect-select': {
              pt: 3,
              pb: 1.25,
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
    </Stack>
  );
};

export default DuelCallComposerForm;
