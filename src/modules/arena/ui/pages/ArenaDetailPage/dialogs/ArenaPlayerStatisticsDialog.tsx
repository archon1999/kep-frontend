import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent } from '@mui/material';
import { ArenaPlayerStatistics } from 'modules/arena/domain/entities/arena-player-statistics.entity.ts';
import DialogHeader from 'shared/components/common/DialogHeader';
import ArenaPlayerStatisticsCard from '../components/ArenaPlayerStatisticsCard.tsx';

interface PlayerStatisticsDialogProps {
  open: boolean;
  onClose: () => void;
  statistics?: ArenaPlayerStatistics;
  loading?: boolean;
  username?: string;
}

const ArenaPlayerStatisticsDialog = ({
  open,
  onClose,
  statistics,
  loading,
  username,
}: PlayerStatisticsDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      aria-labelledby="arena-player-stats-title"
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogHeader
        id="arena-player-stats-title"
        title={t('arena.playerStatistics')}
        subtitle={username}
        onClose={onClose}
      />
      <DialogContent>
        <ArenaPlayerStatisticsCard statistics={statistics} loading={loading} username={username} />
      </DialogContent>
    </Dialog>
  );
};

export default ArenaPlayerStatisticsDialog;
