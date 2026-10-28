import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { contentInsetSx } from 'app/theme/styles/content';
import { useCreateShopReview } from 'modules/shop/application/mutations';
import { useShopOrders } from 'modules/shop/application/queries';
import type { ShopOrder } from 'modules/shop/domain/entities/order.entity';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { formatCalendarDateTime } from 'shared/lib/dateTime';
import { formatInteger } from 'shared/lib/numberFormat';
import { toast } from 'sonner';

const statusColorMap: Record<
  ShopOrder['status'],
  'default' | 'warning' | 'info' | 'success' | 'error'
> = {
  PENDING: 'warning',
  PROCESSING: 'info',
  SHIPPED: 'info',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

const formatOrderDate = (value: string) => formatCalendarDateTime(value);

const PurchaseCardSkeleton = () => (
  <Box>
    <Box sx={contentInsetSx}>
      <Stack direction="column" spacing={2}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rounded" height={140} />
        <Skeleton variant="text" width="60%" />
      </Stack>
    </Box>
  </Box>
);

const shippingTypeLabelMap: Record<ShopOrder['shippingType'], string> = {
  BTS: 'shop.checkout.shippingTypeBts',
};

const UserProfilePurchasesTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const { currentUser } = useAuth();
  const isOwner = currentUser?.username === username;

  const { data: orders, isLoading, error, mutate } = useShopOrders(isOwner);
  const { trigger, isMutating } = useCreateShopReview();
  const [pendingRatings, setPendingRatings] = useState<Record<number, number | null>>({});

  const emptyState = useMemo(
    () => !isLoading && !orders?.length && !error,
    [error, isLoading, orders],
  );

  if (!isOwner) {
    return null;
  }

  const handleReviewSubmit = async (orderId: number) => {
    const stars = pendingRatings[orderId];
    if (!stars) {
      toast.error(t('users.profile.purchases.starsRequired'));
      return;
    }

    try {
      await trigger({ orderId, payload: { stars } });
      await mutate();
      setPendingRatings((prev) => ({ ...prev, [orderId]: null }));
      toast.success(t('users.profile.purchases.reviewSaved'));
    } catch {
      toast.error(t('settings.error'));
    }
  };

  return (
    <Stack direction="column" spacing={0}>
      <SectionHeader title={t('users.profile.purchases.title')} />
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => <PurchaseCardSkeleton key={index} />)
      ) : error ? (
        <Alert severity="error">{t('shop.loadError')}</Alert>
      ) : emptyState ? (
        <Box>
          <Box sx={contentInsetSx}>
            <Typography variant="body1" color="text.secondary">
              {t('users.profile.purchases.empty')}
            </Typography>
          </Box>
        </Box>
      ) : (
        orders?.map((order) => (
          <Box key={order.id} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={contentInsetSx}>
              <Stack direction="column" spacing={2.5}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  gap={1.5}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      component="img"
                      src={order.imageUrl || ''}
                      alt={order.productTitle}
                      sx={{
                        width: 88,
                        height: 88,
                        borderRadius: 0,
                        objectFit: 'cover',
                        bgcolor: 'background.default',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                      }}
                    />
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="h6" fontWeight={500}>
                        {order.productTitle}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip
                          size="small"
                          label={`${t('users.profile.purchases.color')}: ${order.colorName}`}
                        />
                        <Chip
                          size="small"
                          label={`${t('users.profile.purchases.size')}: ${order.sizeName}`}
                        />
                      </Stack>
                    </Stack>
                  </Stack>

                  <Stack
                    direction="column"
                    spacing={1}
                    alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                  >
                    <Chip
                      color={statusColorMap[order.status]}
                      label={t(`users.profile.purchases.statuses.${order.status}`)}
                    />
                    <KepcoinValue value={formatInteger(order.kepcoinValue)} />
                  </Stack>
                </Stack>

                <Divider />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Stack direction="column" spacing={1.25} flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      {t('users.profile.purchases.orderDate')}: {formatOrderDate(order.created)}
                    </Typography>
                    <Typography variant="body2">
                      <Stack
                        component="span"
                        direction="row"
                        spacing={0.75}
                        alignItems="center"
                        useFlexGap
                      >
                        <Typography component="span" variant="body2">
                          {t('users.profile.purchases.delivery')}:
                        </Typography>
                        <CountryFlagIcon code={order.country} size={18} />
                        <Typography component="span" variant="body2">
                          / {t(shippingTypeLabelMap[order.shippingType])}
                        </Typography>
                      </Stack>
                    </Typography>
                    <Typography variant="body2">
                      {t('users.profile.purchases.recipient')}: {order.fullName} ({order.phone})
                    </Typography>
                    <Typography variant="body2">
                      {t('users.profile.purchases.address')}: {order.address}
                    </Typography>
                    <Typography variant="body2">
                      Telegram: @{order.telegramUsername || '-'}
                    </Typography>
                  </Stack>

                  <Stack direction="column" spacing={1.25} flex={1}>
                    {order.trackingCode ? (
                      <Typography variant="body2">
                        {t('users.profile.purchases.trackingCode')}: {order.trackingCode}
                      </Typography>
                    ) : null}
                    {order.adminNote ? (
                      <Typography variant="body2">
                        {t('users.profile.purchases.adminNote')}: {order.adminNote}
                      </Typography>
                    ) : null}

                    {order.review ? (
                      <Stack direction="column" spacing={0.75}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {t('users.profile.purchases.reviewTitle')}
                        </Typography>
                        <Rating value={order.review.stars} precision={1} readOnly />
                      </Stack>
                    ) : order.canReview ? (
                      <Stack direction="column" spacing={1}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {t('users.profile.purchases.reviewTitle')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('users.profile.purchases.reviewHint')}
                        </Typography>
                        <Rating
                          value={pendingRatings[order.id] ?? null}
                          onChange={(_, value) =>
                            setPendingRatings((prev) => ({ ...prev, [order.id]: value }))
                          }
                        />
                        <Button
                          variant="contained"
                          onClick={() => handleReviewSubmit(order.id)}
                          disabled={isMutating}
                          sx={{ width: 'fit-content' }}
                        >
                          {t('users.profile.purchases.submitReview')}
                        </Button>
                      </Stack>
                    ) : null}
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Box>
        ))
      )}
    </Stack>
  );
};

export default UserProfilePurchasesTab;
