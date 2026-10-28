import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import DialogHeader from 'shared/components/common/DialogHeader';

/** Keeps existing confirmation gates asynchronous and resolves dismissal as cancellation. */
export const useConfirmationDialog = () => {
  const { t } = useTranslation();
  const id = useId();
  const [message, setMessage] = useState<string | null>(null);
  const resolver = useRef<((confirmed: boolean) => void) | null>(null);

  const confirm = useCallback((nextMessage: string) => {
    if (resolver.current) return Promise.resolve(false);

    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setMessage(nextMessage);
    });
  }, []);

  const settle = useCallback((confirmed: boolean) => {
    const resolve = resolver.current;
    resolver.current = null;
    setMessage(null);
    resolve?.(confirmed);
  }, []);

  useEffect(
    () => () => {
      resolver.current?.(false);
      resolver.current = null;
    },
    [],
  );

  const confirmationDialog = (
    <Dialog
      open={message !== null}
      onClose={() => settle(false)}
      maxWidth="xs"
      fullWidth
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-message`}
    >
      <DialogHeader
        id={`${id}-title`}
        title={t('common.confirmTitle')}
        onClose={() => settle(false)}
      />
      <DialogContent>
        <Typography id={`${id}-message`} sx={{ overflowWrap: 'anywhere' }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => settle(false)}>
          {t('common.cancel')}
        </Button>
        <Button variant="contained" onClick={() => settle(true)}>
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { confirm, confirmationDialog };
};
