import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { ArenaPlayerStatistics } from 'modules/arena/domain/entities/arena-player-statistics.entity.ts';
import ArenaDetailPagePlayerStatisticsCard from '../components/ArenaDetailPagePlayerStatisticsCard.tsx';

interface ArenaDetailPagePlayerStatisticsDialogProps {
  open: boolean;
  onClose: () => void;
  statistics?: ArenaPlayerStatistics;
  loading?: boolean;
  username?: string;
}

const ArenaDetailPagePlayerStatisticsDialog = ({
  open,
  onClose,
  statistics,
  loading,
  username,
}: ArenaDetailPagePlayerStatisticsDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="end">
          <IconButton
            aria-label={t('common.close')}
            onClick={onClose}
          >
            <IconifyIcon icon="mdi:close" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <ArenaDetailPagePlayerStatisticsCard
          statistics={statistics}
          loading={loading}
          username={username}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ArenaDetailPagePlayerStatisticsDialog;
