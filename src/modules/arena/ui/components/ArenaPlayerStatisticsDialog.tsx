import { useTranslation } from 'react-i18next';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import UserPopover from 'modules/users/ui/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity.ts';
import ArenaPlayerStatisticsCard from './ArenaPlayerStatisticsCard.tsx';

interface ArenaPlayerStatisticsDialogProps {
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
}: ArenaPlayerStatisticsDialogProps) => {
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
        <ArenaPlayerStatisticsCard statistics={statistics} loading={loading} username={username} />
      </DialogContent>
    </Dialog>
  );
};

export default ArenaPlayerStatisticsDialog;
