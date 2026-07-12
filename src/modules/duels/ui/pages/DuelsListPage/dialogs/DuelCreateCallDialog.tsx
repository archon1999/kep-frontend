import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DuelPreset, DuelTypeInfo } from 'modules/duels/domain/index.ts';
import DuelCallComposerForm from '../components/DuelCallComposerForm.tsx';

type Props = {
  open: boolean;
  presets: DuelPreset[];
  duelTypes: DuelTypeInfo[];
  disabled?: boolean;
  onClose: () => void;
  onSubmit: (payload: { duelPresetId: number; duelTypeId: number }) => void | Promise<void>;
};

const DuelCreateCallDialog = ({
  open,
  presets,
  duelTypes,
  disabled,
  onClose,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');

  useEffect(() => {
    if (!selectedPresetId && presets.length) {
      setSelectedPresetId(String(presets[0]?.id ?? ''));
    }
  }, [presets, selectedPresetId]);

  useEffect(() => {
    if (!selectedTypeId && duelTypes.length) {
      const preferredType = duelTypes.find((duelType) => duelType.code === 'BallF');
      setSelectedTypeId(String(preferredType?.id ?? duelTypes[0]?.id ?? ''));
    }
  }, [duelTypes, selectedTypeId]);

  const handleSubmit = async () => {
    if (!selectedPresetId || !selectedTypeId) return;
    await onSubmit({
      duelPresetId: Number(selectedPresetId),
      duelTypeId: Number(selectedTypeId),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('duels.createCallTitle')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} mt={1}>
          <Typography variant="body2" color="text.secondary">
            {t('duels.createCallDescription')}
          </Typography>
          <DuelCallComposerForm
            presets={presets}
            duelTypes={duelTypes}
            selectedPresetId={selectedPresetId}
            selectedTypeId={selectedTypeId}
            onPresetChange={setSelectedPresetId}
            onTypeChange={setSelectedTypeId}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={onClose}>
          {t('duels.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            void handleSubmit();
          }}
          disabled={disabled || !selectedPresetId || !selectedTypeId}
          sx={{ borderRadius: 999 }}
        >
          {t('duels.createDuel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuelCreateCallDialog;
