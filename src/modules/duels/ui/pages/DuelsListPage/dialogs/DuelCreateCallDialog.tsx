import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, Skeleton, Stack } from '@mui/material';
import { DuelPreset, DuelTypeInfo } from 'modules/duels/domain/index.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DialogHeader from 'shared/components/common/DialogHeader';
import EmptyState from 'shared/components/common/EmptyState';
import DuelCallComposerForm from '../components/DuelCallComposerForm.tsx';

type Props = {
  open: boolean;
  presets: DuelPreset[];
  duelTypes: DuelTypeInfo[];
  disabled?: boolean;
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  onClose: () => void;
  onSubmit: (payload: { duelPresetId: number; duelTypeId: number }) => void | Promise<void>;
};

const DuelCreateCallDialog = ({
  open,
  presets,
  duelTypes,
  disabled,
  loading,
  error,
  onRetry,
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
    if (
      !presets.some((preset) => String(preset.id) === selectedPresetId) ||
      !duelTypes.some((type) => String(type.id) === selectedTypeId)
    )
      return;
    await onSubmit({
      duelPresetId: Number(selectedPresetId),
      duelTypeId: Number(selectedTypeId),
    });
  };

  return (
    <Dialog
      aria-labelledby="duel-create-title"
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogHeader
        id="duel-create-title"
        title={t('duels.createCallTitle')}
        subtitle={t('duels.createCallDescription')}
        icon={<IconifyIcon icon="mdi:sword-cross" color="primary.main" />}
        onClose={onClose}
      />
      <DialogContent sx={{ py: 3 }}>
        {loading ? (
          <Stack gap={2.5}>
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={160} />
          </Stack>
        ) : error ? (
          <EmptyState
            kind="error"
            compact
            title={t('duels.error')}
            action={onRetry && <Button onClick={onRetry}>{t('common.retry')}</Button>}
          />
        ) : (
          <DuelCallComposerForm
            presets={presets}
            duelTypes={duelTypes}
            selectedPresetId={selectedPresetId}
            selectedTypeId={selectedTypeId}
            onPresetChange={setSelectedPresetId}
            onTypeChange={setSelectedTypeId}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose} autoFocus>
          {t('duels.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            void handleSubmit();
          }}
          disabled={
            disabled ||
            loading ||
            Boolean(error) ||
            !presets.some((preset) => String(preset.id) === selectedPresetId) ||
            !duelTypes.some((type) => String(type.id) === selectedTypeId)
          }
          loading={disabled}
          endIcon={<IconifyIcon icon="mdi:arrow-right" />}
        >
          {t('duels.createDuel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuelCreateCallDialog;
