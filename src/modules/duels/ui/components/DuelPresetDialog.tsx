import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
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
  const [presetId, setPresetId] = useState<number | ''>('');
  const [startTime, setStartTime] = useState(defaultStartTime ?? '');

  const selectedPreset = useMemo(() => presets.find((preset) => preset.id === presetId), [presets, presetId]);

  useEffect(() => {
    if (!presetId && presets.length) {
      setPresetId(presets[0].id ?? '');
    }
  }, [presets, presetId]);

  useEffect(() => {
    if (defaultStartTime) {
      setStartTime(defaultStartTime);
    }
  }, [defaultStartTime]);

  const handleSubmit = () => {
    if (!presetId || !startTime) return;
    onSubmit({ presetId, startTime });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('duels.selectPreset')}
        <Typography variant="body2" color="text.secondary">
          {t('duels.selectPresetDescription', { username: opponent?.username ?? '' })}
        </Typography>
      </DialogTitle>
      {loading ? <LinearProgress /> : null}
      <DialogContent>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="duel-preset-label">{t('duels.preset')}</InputLabel>
            <Select
              labelId="duel-preset-label"
              label={t('duels.preset')}
              value={presetId}
              onChange={(event) => setPresetId(Number(event.target.value))}
            >
              {presets.map((preset) => (
                <MenuItem key={preset.id} value={preset.id ?? ''}>
                  <Stack spacing={0.25}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {preset.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {preset.description}
                    </Typography>
                  </Stack>
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
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('duels.presetDetails')}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {selectedPreset.duration} • {selectedPreset.difficultyDisplay}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedPreset.problemsCount
                  ? t('duels.presetProblemsCount', { count: selectedPreset.problemsCount })
                  : null}
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="text" color="inherit" onClick={onClose}>
          {t('duels.cancel')}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!presetId || !startTime} color="primary">
          {t('duels.createDuel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuelPresetDialog;
