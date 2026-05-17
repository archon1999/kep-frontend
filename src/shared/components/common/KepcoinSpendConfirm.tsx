import { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useAuth } from 'app/providers/AuthProvider';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { formatInteger } from 'shared/lib/numberFormat';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import KepcoinValue from './KepcoinValue';

interface KepcoinSpendConfirmProps {
  value: number;
  purchaseUrl: string;
  requestBody?: Record<string, unknown>;
  onSuccess?: (response: unknown) => void | Promise<void>;
  children?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
}

const KepcoinSpendConfirm = ({
  value,
  purchaseUrl,
  requestBody = {},
  onSuccess,
  children,
  disabled = false,
  fullWidth = false,
}: KepcoinSpendConfirmProps) => {
  const { t } = useTranslation();
  const { currentUser, refreshCurrentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();

  const [open, setOpen] = useState(false);

  const { trigger, isMutating } = useSWRMutation([purchaseUrl, { method: 'post' }], axiosFetcher);

  const formattedValue = useMemo(() => formatInteger(value), [value]);
  const userBalance = useMemo(() => currentUser?.kepcoin ?? 0, [currentUser?.kepcoin]);

  const handleTriggerClick = () => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

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
      if (
        response &&
        typeof response === 'object' &&
        'success' in response &&
        response.success === false
      ) {
        throw new Error(String(response.message ?? response.error ?? t('kepcoinSpend.error')));
      }

      toast.success(t('kepcoinSpend.success'));
      await onSuccess?.(response);
      await refreshCurrentUser();
      setOpen(false);
    } catch (error: any) {
      const fallbackMessage = t('kepcoinSpend.error');
      const message =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.message ??
        fallbackMessage;
      toast.error(message);
    }
  };

  return (
    <>
      <ButtonBase
        onClick={handleTriggerClick}
        disabled={disabled && Boolean(currentUser)}
        sx={{
          borderRadius: 1,
          width: fullWidth ? 1 : 'fit-content',
          px: children ? 0 : 1,
          py: children ? 0 : 0.75,
        }}
      >
        {children ?? (
          <KepcoinValue
            value={formattedValue}
            iconSize={16}
            textVariant="caption"
            fontWeight={600}
          />
        )}
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
              <KepcoinValue
                value={formattedValue}
                iconSize={20}
                textVariant="body2"
                fontWeight={700}
              />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {t('kepcoinSpend.balanceLabel')}
              </Typography>
              <KepcoinValue
                value={formatInteger(userBalance)}
                iconSize={20}
                textVariant="body2"
                fontWeight={700}
              />
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
