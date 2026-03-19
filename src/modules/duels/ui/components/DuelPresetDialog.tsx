import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { cssVarRgba } from 'shared/lib/utils.ts';
import { DuelPreset, DuelReadyPlayer } from '../../domain/index.ts';

type Props = {
  open: boolean;
  presets: DuelPreset[];
  loading?: boolean;
  opponent?: DuelReadyPlayer | null;
  minStartTime?: string;
  defaultStartTime?: string;
  onClose: () => void;
  onSubmit: (payload: { presetId: number; startTime: string }) => void;
};

const DifficultyStars = ({ difficulty = 0 }: { difficulty?: number }) => (
  <Stack direction="row" spacing={0.15} alignItems="center" justifyContent="flex-end">
    {Array.from({ length: 5 }).map((_, index) => {
      const filled = index < difficulty;
      return (
        <IconifyIcon
          key={index}
          icon={filled ? 'mdi:star' : 'mdi:star-outline'}
          sx={{
            fontSize: 18,
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
    <Stack spacing={compact ? 0.2 : 0.45} sx={{ minWidth: 0, flex: 1 }}>
      <Typography variant={compact ? 'subtitle2' : 'subtitle1'} fontWeight={800} noWrap>
        {preset.title}
      </Typography>
      {!compact ? (
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
      ) : (
        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" rowGap={0.5}>
          <Chip
            size="small"
            color="primary"
            variant="outlined"
            label={preset.duration}
            sx={{ fontWeight: 700 }}
          />
          {preset.problemsCount ? (
            <Chip
              size="small"
              variant="outlined"
              label={`${preset.problemsCount}P`}
              sx={{ fontWeight: 700 }}
            />
          ) : null}
        </Stack>
      )}
    </Stack>

    <Stack spacing={0.4} minWidth={compact ? 88 : 118} alignItems="flex-end">
      <DifficultyStars difficulty={preset.difficulty} />
      <Typography variant="caption" color="text.secondary" fontWeight={700} noWrap>
        {preset.difficultyDisplay}
      </Typography>
    </Stack>
  </Stack>
);

const DuelPresetDialog = ({
  open,
  presets,
  loading,
  opponent,
  minStartTime,
  defaultStartTime,
  onClose,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [presetId, setPresetId] = useState('');
  const [startTime, setStartTime] = useState(defaultStartTime ?? '');

  const selectedPreset = useMemo(
    () => presets.find((preset) => String(preset.id ?? '') === presetId),
    [presets, presetId],
  );

  useEffect(() => {
    if (!presetId && presets.length) {
      setPresetId(String(presets[0].id ?? ''));
    }
  }, [presets, presetId]);

  useEffect(() => {
    if (defaultStartTime) {
      setStartTime(defaultStartTime);
    }
  }, [defaultStartTime]);

  useEffect(() => {
    if (!open) {
      setPresetId('');
      setStartTime(defaultStartTime ?? '');
    }
  }, [defaultStartTime, open]);

  const handleSubmit = () => {
    if (!presetId || !startTime) return;
    onSubmit({ presetId: Number(presetId), startTime });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          background: `linear-gradient(180deg, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.background.paperChannel, 0.98)})`,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1.5 }}>
        <Stack spacing={0.75}>
          <Typography variant="h5" fontWeight={900}>
            {t('duels.selectPreset')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('duels.selectPresetDescription', { username: opponent?.username ?? '' })}
          </Typography>
        </Stack>
      </DialogTitle>
      {loading ? <LinearProgress /> : null}
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2.5}>
          <FormControl fullWidth>
            <InputLabel id="duel-preset-label">{t('duels.preset')}</InputLabel>
            <Select
              labelId="duel-preset-label"
              value={presetId}
              onChange={(event) => {
                const nextValue = event.target.value;
                setPresetId(String(nextValue));
              }}
              input={<OutlinedInput label={t('duels.preset')} />}
              renderValue={(value) => {
                const preset = presets.find((item) => String(item.id ?? '') === String(value));
                if (!preset) {
                  return (
                    <Typography variant="body2" color="text.secondary">
                      {t('duels.preset')}
                    </Typography>
                  );
                }

                return <PresetOptionContent preset={preset} compact />;
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 1,
                    borderRadius: 3,
                    p: 1,
                    backgroundColor: 'background.paper',
                  },
                },
              }}
              sx={{
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
            >
              {presets.map((preset) => (
                <MenuItem
                  key={preset.id}
                  value={String(preset.id ?? '')}
                  sx={{
                    borderRadius: 2,
                    alignItems: 'stretch',
                    py: 1.25,
                    my: 0.25,
                  }}
                >
                  <PresetOptionContent preset={preset} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={t('duels.startTime')}
            type="datetime-local"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            inputProps={{ min: minStartTime }}
            fullWidth
          />

          {selectedPreset ? (
            <Box
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.16),
                backgroundColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.06),
                p: 2,
              }}
            >
              <Stack spacing={1.25}>
                <Stack direction="row" justifyContent="space-between" spacing={2} flexWrap="wrap">
                  <Stack spacing={0.4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('duels.presetDetails')}
                    </Typography>
                    <Typography variant="h6" fontWeight={800}>
                      {selectedPreset.title}
                    </Typography>
                  </Stack>
                  <DifficultyStars difficulty={selectedPreset.difficulty} />
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                  <Chip
                    size="small"
                    color="primary"
                    variant="filled"
                    label={selectedPreset.duration}
                    sx={{ fontWeight: 700 }}
                  />
                  {selectedPreset.problemsCount ? (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={t('duels.presetProblemsCount', { count: selectedPreset.problemsCount })}
                      sx={{ fontWeight: 700 }}
                    />
                  ) : null}
                  {selectedPreset.difficultyDisplay ? (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={selectedPreset.difficultyDisplay}
                      sx={{ fontWeight: 700 }}
                    />
                  ) : null}
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {selectedPreset.description}
                </Typography>
              </Stack>
            </Box>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="text" color="inherit" onClick={onClose}>
          {t('duels.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!presetId || !startTime || !presets.length}
          color="primary"
          sx={{ borderRadius: 999, px: 2.5 }}
        >
          {t('duels.sendInvitation')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuelPresetDialog;
