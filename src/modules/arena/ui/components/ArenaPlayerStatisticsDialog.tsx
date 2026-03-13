import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity.ts';
import ArenaPlayerStatisticsCard from './ArenaPlayerStatisticsCard.tsx';
import UserPopover from 'modules/users/ui/components/UserPopover';

interface ArenaPlayerStatisticsDialogProps {
  open: boolean;
  onClose: () => void;
  statistics?: ArenaPlayerStatistics;
  loading?: boolean;
  username?: string;
}

const ArenaPlayerStatisticsDialog = ({ open, onClose, statistics, loading, username }: ArenaPlayerStatisticsDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <UserPopover username={statistics?.username || username || ''}>
            <Stack direction="row" spacing={0.25}>
              <Typography variant="overline" color="text.secondary">
                {t('arena.playerStatistics')}
              </Typography>
              <Typography variant="h6" fontWeight={800}>
                {statistics?.username || username || t('arena.selectPlayer')}
              </Typography>
            </Stack>
          </UserPopover>
          <IconButton aria-label={t('arena.playerStatistics')} onClick={onClose}>
            <IconifyIcon icon="mdi:close" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <ArenaPlayerStatisticsCard statistics={statistics} loading={loading} username={username} />
      </DialogContent>
    </Dialog>
  );
};

export default ArenaPlayerStatisticsDialog;
