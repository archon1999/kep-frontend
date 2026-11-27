import {
  MouseEvent,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import DialogHeader from 'shared/components/common/DialogHeader';
import { useScopedAsyncTask } from 'shared/hooks/useScopedAsyncTask';
import { getApiErrorMessage } from 'shared/lib/apiError';
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

type TriggerElementProps = {
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

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
  const [purchaseError, setPurchaseError] = useState('');

  const { trigger } = useSWRMutation([purchaseUrl, { method: 'post' }], axiosFetcher);
  const { isPending: isSubmitting, run } = useScopedAsyncTask(purchaseUrl);

  const formattedValue = useMemo(() => formatInteger(value), [value]);
  const userBalance = useMemo(() => currentUser?.kepcoin ?? 0, [currentUser?.kepcoin]);

  const handleTriggerClick = () => {
    if (isSubmitting) return;
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    if (disabled) return;

    if (userBalance < value) {
      toast.error(t('kepcoinSpend.insufficientBalance'));
      return;
    }

    setPurchaseError('');
    setOpen(true);
  };

  const triggerDisabled = isSubmitting || (disabled && Boolean(currentUser));

  const renderTrigger = () => {
    if (isValidElement<TriggerElementProps>(children)) {
      const child = children as ReactElement<TriggerElementProps>;
      const childDisabled = Boolean(child.props.disabled);

      return cloneElement(child, {
        disabled: childDisabled || triggerDisabled,
        onClick: (event: MouseEvent<HTMLElement>) => {
          child.props.onClick?.(event);

          if (!event.defaultPrevented && !childDisabled) {
            handleTriggerClick();
          }
        },
      });
    }

    return (
      <ButtonBase
        onClick={handleTriggerClick}
        disabled={triggerDisabled}
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
    );
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setOpen(false);
      setPurchaseError('');
    }
  };

  const handleConfirm = () => {
    if (isSubmitting) return;
    setPurchaseError('');
    const fallbackMessage = t('kepcoinSpend.error');

    void run(
      async () => {
        const response = await trigger(requestBody);
        if (response && typeof response === 'object' && response.success === false) {
          throw new Error(getApiErrorMessage({ data: response }, fallbackMessage));
        }
        return response;
      },
      {
        onSuccess: async (response) => {
          toast.success(t('kepcoinSpend.success'));
          let refreshFailed = false;
          try {
            await onSuccess?.(response);
          } catch {
            refreshFailed = true;
          }
          try {
            await refreshCurrentUser();
          } catch {
            refreshFailed = true;
          }
          setOpen(false);
          if (refreshFailed) toast.warning(t('kepcoinSpend.refreshFailed'));
        },
        onError: (error) => setPurchaseError(getApiErrorMessage(error, fallbackMessage)),
      },
    );
  };

  return (
    <>
      {renderTrigger()}

      <Dialog
        aria-labelledby="kepcoin-spend-title"
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogHeader
          id="kepcoin-spend-title"
          title={t('kepcoinSpend.confirmTitle')}
          onClose={handleClose}
          closeDisabled={isSubmitting}
        />
        <DialogContent aria-busy={isSubmitting}>
          <Stack direction="column" spacing={2}>
            <DialogContentText>{t('kepcoinSpend.confirmDescription')}</DialogContentText>
            {purchaseError ? <Alert severity="error">{purchaseError}</Alert> : null}
            {isSubmitting ? <LinearProgress aria-label={t('common.loading')} /> : null}

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
          <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
            {t('kepcoinSpend.cancelAction')}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            aria-disabled={isSubmitting}
            sx={{ '&[aria-disabled="true"]': { opacity: 0.65 } }}
          >
            {t('kepcoinSpend.confirmAction')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KepcoinSpendConfirm;
