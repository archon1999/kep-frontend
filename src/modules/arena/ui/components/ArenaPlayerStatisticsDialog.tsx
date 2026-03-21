import { Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from '@mui/material';
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(180deg, rgba(255,193,7,0.10), rgba(255,255,255,0.96) 38%)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <UserPopover username={statistics?.username || username || ''} avatar={statistics?.avatar}>
            <Stack direction="column" spacing={0.5}>
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
      <Divider />
      <DialogContent sx={{ pt: 2.5, pb: 3 }}>
        <ArenaPlayerStatisticsCard statistics={statistics} loading={loading} username={username} />
      </DialogContent>
    </Dialog>
  );
};

export default ArenaPlayerStatisticsDialog;
