import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DuelPreset, DuelTypeInfo } from 'modules/duels/domain/index.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import DuelCallComposerForm from './DuelCallComposerForm.tsx';

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

  return (
    <Card
      variant="section"
      sx={(theme) => ({
        borderRadius: 0,
        borderColor: alpha(theme.palette.primary.main, 0.12),
      })}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2.5}>
          <Stack spacing={0.75}>
            <Typography variant="h6" fontWeight={600}>
              {t('duels.createCallTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('duels.createCallDescription')}
            </Typography>
          </Stack>

          <DuelCallComposerForm
            presets={presets}
            duelTypes={duelTypes}
            selectedPresetId={selectedPresetId}
            selectedTypeId={selectedTypeId}
            onPresetChange={onPresetChange}
            onTypeChange={onTypeChange}
          />

          <Button
            variant="contained"
            size="large"
            onClick={onSubmit}
            disabled={disabled || !selectedPresetId || !selectedTypeId}
            startIcon={<IconifyIcon icon="mdi:sword-cross" width={18} height={18} />}
            fullWidth
            sx={{ borderRadius: 999, px: 2.5 }}
          >
            {t('duels.createDuel')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelCallComposerCard;
