import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useCreateShopOrder } from 'modules/shop/application/mutations';
import { CreateShopOrderPayload } from 'modules/shop/domain/entities/order.entity';
import { ShopProductColor, ShopProductSize } from 'modules/shop/domain/entities/product.entity';
import { useUserSocial } from 'modules/users/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { formatInteger } from 'shared/lib/numberFormat';
import { toast } from 'sonner';

const PHONE_RE = /^(?:\+?998)?\d{9}$/;

interface ShopCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  productTitle: string;
  color?: ShopProductColor;
  variant?: ShopProductSize;
  price: number;
  onSuccess: () => void;
}

const normalizeUzPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!PHONE_RE.test(value) && !PHONE_RE.test(digits)) {
    throw new Error('invalid-phone');
  }

  if (digits.length === 9) {
    return `+998${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('998')) {
    return `+${digits}`;
  }

  throw new Error('invalid-phone');
};

const mapErrorValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.join(' ');
  }

  if (typeof value === 'string') {
    return value;
  }

  return '';
};

const ShopCheckoutModal = ({
  open,
  onClose,
  productTitle,
  color,
  variant,
  price,
  onSuccess,
}: ShopCheckoutModalProps) => {
  const { t } = useTranslation();
  const { currentUser, refreshCurrentUser } = useAuth();
  const { data: social } = useUserSocial(currentUser?.username);
  const { trigger, isMutating } = useCreateShopOrder();

  const [formState, setFormState] = useState<CreateShopOrderPayload>({
    variant_id: variant?.variantId ?? 0,
    country: 'UZB',
    shipping_type: 'BTS',
    full_name: currentUser?.name ?? currentUser?.firstName ?? '',
    phone: '',
    address: '',
    telegram_username: social?.telegram?.replace('@', '') ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingPayload, setPendingPayload] = useState<CreateShopOrderPayload | null>(null);

  const hasEnoughBalance = (currentUser?.kepcoin ?? 0) >= price;
  const canSubmit =
    Boolean(variant && variant.isAvailable) &&
    Boolean(formState.full_name.trim()) &&
    Boolean(formState.phone.trim()) &&
    Boolean(formState.address.trim()) &&
    Boolean(formState.telegram_username.trim()) &&
    hasEnoughBalance;

  useEffect(() => {
    if (!open) {
      setErrors({});
      setPendingPayload(null);
      return;
    }

    setFormState((prev) => ({
      ...prev,
      variant_id: variant?.variantId ?? prev.variant_id,
      full_name: prev.full_name || currentUser?.name || currentUser?.firstName || '',
      telegram_username: social?.telegram?.replace('@', '') ?? prev.telegram_username,
    }));
  }, [currentUser?.firstName, currentUser?.name, open, social?.telegram, variant?.variantId]);

  const handleChange =
    (field: keyof CreateShopOrderPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  const handleSubmitClick = () => {
    if (!variant) return;

    try {
      const payload: CreateShopOrderPayload = {
        ...formState,
        variant_id: variant.variantId,
        phone: normalizeUzPhone(formState.phone),
      };
      setPendingPayload(payload);
    } catch {
      setErrors((prev) => ({
        ...prev,
        phone: t('shop.checkout.invalidPhone', 'Invalid phone number'),
      }));
    }
  };

  const handleConfirmPurchase = async () => {
    if (!pendingPayload) return;

    try {
      await trigger(pendingPayload);
      await refreshCurrentUser();
      toast.success(t('shop.checkout.success'));
      await onSuccess();
      setPendingPayload(null);
      onClose();
    } catch (error: any) {
      if (error?.data) {
        setErrors(
          Object.entries(error.data).reduce<Record<string, string>>((acc, [key, value]) => {
            acc[key] = mapErrorValue(value);
            return acc;
          }, {}),
        );
        setPendingPayload(null);
        return;
      }
      toast.error(t('shop.checkout.error'));
    }
  };

  const disabledReason = useMemo(() => {
    if (!variant) return t('shop.checkout.noVariant');
    if (!variant.isAvailable) return t('shop.checkout.outOfStock');
    if (!hasEnoughBalance) return t('shop.checkout.insufficientBalance');
    return '';
  }, [hasEnoughBalance, variant, t]);

  const renderTooltipIcon = (title: string) => (
    <Tooltip title={title} placement="top">
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          color: 'text.secondary',
          cursor: 'help',
          ml: 0.75,
        }}
      >
        <IconifyIcon icon="mdi:information-outline" fontSize={16} />
      </Box>
    </Tooltip>
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>{t('shop.checkout.title')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              {productTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {color?.name} / {variant?.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption">{t('shop.checkout.price')}</Typography>
              <KepcoinValue value={price} textVariant="subtitle2" />
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                },
              }}
            >
              <Box>
                <TextField
                  label={t('shop.checkout.country')}
                  value={formState.country}
                  onChange={handleChange('country')}
                  fullWidth
                  select
                  disabled
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                >
                  <MenuItem value="UZB">{t('shop.checkout.countryUz')}</MenuItem>
                </TextField>
                {renderTooltipIcon(t('shop.checkout.countryNotice'))}
              </Box>
              <Box>
                <TextField
                  label={t('shop.checkout.shippingType')}
                  value={formState.shipping_type}
                  onChange={handleChange('shipping_type')}
                  fullWidth
                  select
                  disabled
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                >
                  <MenuItem value="BTS">{t('shop.checkout.shippingTypeBts')}</MenuItem>
                </TextField>
                {renderTooltipIcon(t('shop.checkout.shippingTypeHint'))}
              </Box>
              <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
                <TextField
                  label={t('shop.checkout.fullName')}
                  value={formState.full_name}
                  onChange={handleChange('full_name')}
                  fullWidth
                  error={Boolean(errors.full_name)}
                  helperText={errors.full_name}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
                <TextField
                  label={t('shop.checkout.phone')}
                  value={formState.phone}
                  onChange={handleChange('phone')}
                  fullWidth
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
                <TextField
                  label={t('shop.checkout.address')}
                  value={formState.address}
                  onChange={handleChange('address')}
                  fullWidth
                  error={Boolean(errors.address)}
                  helperText={errors.address}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
                <TextField
                  label={t('shop.checkout.telegram')}
                  value={formState.telegram_username}
                  onChange={handleChange('telegram_username')}
                  fullWidth
                  error={Boolean(errors.telegram_username)}
                  helperText={errors.telegram_username}
                />
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {disabledReason}
            </Typography>
          </Box>
          <Button onClick={onClose} color="inherit" disabled={isMutating}>
            {t('shop.checkout.cancel')}
          </Button>
          <Button
            onClick={handleSubmitClick}
            variant="contained"
            disabled={!canSubmit || isMutating || Boolean(disabledReason)}
          >
            {t('shop.checkout.buy')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(pendingPayload)}
        onClose={() => !isMutating && setPendingPayload(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{t('kepcoinSpend.confirmTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>{t('kepcoinSpend.confirmDescription')}</DialogContentText>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {t('shop.checkout.price')}
              </Typography>
              <KepcoinValue value={price} iconSize={20} textVariant="body2" fontWeight={700} />
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {t('kepcoinSpend.balanceLabel')}
              </Typography>
              <KepcoinValue
                value={formatInteger(currentUser?.kepcoin ?? 0)}
                iconSize={20}
                textVariant="body2"
                fontWeight={700}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPendingPayload(null)} color="inherit" disabled={isMutating}>
            {t('kepcoinSpend.cancelAction')}
          </Button>
          <Button onClick={handleConfirmPurchase} variant="contained" disabled={isMutating}>
            {t('kepcoinSpend.confirmAction')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShopCheckoutModal;
