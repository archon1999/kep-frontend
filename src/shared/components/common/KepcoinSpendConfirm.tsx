import { ReactNode, useMemo, useState } from 'react';
import {
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import { useAuth } from 'app/providers/AuthProvider';
import KepcoinValue from './KepcoinValue';
import axiosFetcher from 'shared/services/axios/axiosFetcher';

interface KepcoinSpendConfirmProps {
  value: number;
  purchaseUrl: string;
  requestBody?: Record<string, unknown>;
  onSuccess?: (response: unknown) => void;
  children?: ReactNode;
  disabled?: boolean;
}

const KepcoinSpendConfirm = ({
  value,
  purchaseUrl,
  requestBody = {},
  onSuccess,
  children,
  disabled = false,
}: KepcoinSpendConfirmProps) => {
  const { t } = useTranslation();
  const { currentUser, refreshCurrentUser } = useAuth();

  const [open, setOpen] = useState(false);

  const { trigger, isMutating } = useSWRMutation([purchaseUrl, { method: 'post' }], axiosFetcher);

  const formattedValue = useMemo(() => value.toLocaleString(), [value]);
  const userBalance = useMemo(() => currentUser?.kepcoin ?? 0, [currentUser?.kepcoin]);

  const handleTriggerClick = () => {
    if (disabled) return;

    if (userBalance < value) {
      toast.error(t('kepcoinSpend.insufficientBalance'));
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    if (!isMutating) {
      setOpen(false);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await trigger(requestBody);
      toast.success(t('kepcoinSpend.success'));
      onSuccess?.(response);
      await refreshCurrentUser();
      setOpen(false);
    } catch (error: any) {
      const fallbackMessage = t('kepcoinSpend.error');
      const message = error?.response?.data?.message ?? error?.message ?? fallbackMessage;
      toast.error(message);
    }
  };

  return (
    <>
      <ButtonBase
        onClick={handleTriggerClick}
        disabled={disabled}
        sx={{
          borderRadius: 1,
          width: 'fit-content',
          px: children ? 0 : 1,
          py: children ? 0 : 0.75,
        }}
      >
        {children ?? <KepcoinValue value={formattedValue} iconSize={16} textVariant="caption" fontWeight={600} />}
      </ButtonBase>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{t('kepcoinSpend.confirmTitle')}</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <DialogContentText>{t('kepcoinSpend.confirmDescription')}</DialogContentText>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {t('kepcoinSpend.costLabel')}
              </Typography>
              <KepcoinValue value={formattedValue} iconSize={20} textVariant="body2" fontWeight={700} />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {t('kepcoinSpend.balanceLabel')}
              </Typography>
              <KepcoinValue value={userBalance.toLocaleString()} iconSize={20} textVariant="body2" fontWeight={700} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={isMutating}>
            {t('kepcoinSpend.cancelAction')}
          </Button>
          <Button onClick={handleConfirm} variant="contained" disabled={isMutating}>
            {t('kepcoinSpend.confirmAction')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KepcoinSpendConfirm;
