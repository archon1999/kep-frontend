import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { ShopProduct } from '../../domain/entities/product.entity';
import ShopCheckoutModal from './ShopCheckoutModal';

interface ShopProductCardProps {
  product: ShopProduct;
  onPurchaseSuccess: () => Promise<void>;
}

const ShopProductCard = ({ product, onPurchaseSuccess }: ShopProductCardProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const colors = product.colors.length ? product.colors : [];
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const selectedColor = colors[selectedColorIndex] ?? colors[0];
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const colorImages = selectedColor?.images?.length ? selectedColor.images : product.images;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentImage = colorImages[currentImageIndex];
  const sizes = selectedColor?.sizes ?? [];
  const selectedSize = sizes[selectedSizeIndex];
  const hasMultipleImages = colorImages.length > 1;
  const hasEnoughBalance = (currentUser?.kepcoin ?? 0) >= product.kepcoin;
  const buyDisabled = !selectedSize?.isAvailable || !hasEnoughBalance;
  const buyDisabledReason = !selectedSize?.isAvailable
    ? t('shop.checkout.outOfStock')
    : !hasEnoughBalance
      ? t('shop.checkout.insufficientBalance')
      : '';

  useEffect(() => {
    setSelectedSizeIndex(0);
  }, [selectedColorIndex]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColorIndex, colorImages.length]);

  const variantCaption = useMemo(() => {
    if (!selectedSize) return null;

    return t('shop.variant.caption', {
      color: selectedColor?.name ?? '',
      size: selectedSize.name,
    });
  }, [selectedColor?.name, selectedSize, t]);

  const handleImageShift = (direction: 'prev' | 'next') => {
    if (!hasMultipleImages) {
      return;
    }

    setCurrentImageIndex((prev) => {
      if (direction === 'prev') {
        return (prev - 1 + colorImages.length) % colorImages.length;
      }

      return (prev + 1) % colorImages.length;
    });
  };

  const handlePurchaseSuccess = async () => {
    await onPurchaseSuccess();
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          height: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'relative', bgcolor: 'background.paper', height: 500 }}>
          {currentImage ? (
            <Box
              component="img"
              src={currentImage.url}
              alt={currentImage.name || product.title}
              sx={{ width: 1, height: 1, objectFit: 'cover' }}
            />
          ) : (
            <Stack
              sx={{
                width: 1,
                height: 1,
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <IconifyIcon icon="mdi:store" fontSize={36} />
              <Typography variant="body2">{t('shop.noImage')}</Typography>
            </Stack>
          )}

          {hasMultipleImages && (
            <>
              <IconButton
                size="small"
                onClick={() => handleImageShift('prev')}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 12,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.45)',
                  color: 'common.white',
                }}
              >
                <IconifyIcon icon="mdi:chevron-left" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleImageShift('next')}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 12,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.45)',
                  color: 'common.white',
                }}
              >
                <IconifyIcon icon="mdi:chevron-right" />
              </IconButton>
            </>
          )}
        </Box>

        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
          <CardHeader
            title={product.title}
            subheader={
              <Stack direction="row" spacing={1} alignItems="center">
                <Rating value={product.ratingAverage ?? 5} precision={0.1} size="small" readOnly />
                {product.ratingCount > 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    ({product.ratingCount})
                  </Typography>
                ) : null}
              </Stack>
            }
            sx={{ px: 0, '& .MuiCardHeader-title': { fontWeight: 700 } }}
          />

          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              {t('shop.colorLabel')}
            </Typography>
            <Stack direction="row" spacing={1}>
              {colors.map((color, index) => {
                const isSelected = index === selectedColorIndex;

                return (
                  <Box
                    key={`color-${color.name}-${index}`}
                    onClick={() => setSelectedColorIndex(index)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: 2,
                      borderColor: isSelected ? 'primary.main' : 'transparent',
                      boxShadow: (theme) =>
                        isSelected ? `0 0 0 1px ${theme.palette.primary.dark}` : 'none',
                      background: color.color,
                      cursor: 'pointer',
                    }}
                    role="button"
                    aria-label={color.name}
                  />
                );
              })}
            </Stack>
          </Stack>

          {sizes.length > 0 ? (
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                {t('shop.sizeLabel')}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {sizes.map((size, index) => (
                  <Chip
                    key={`size-${size.name}-${index}`}
                    label={size.name}
                    variant={index === selectedSizeIndex ? 'filled' : 'outlined'}
                    color={index === selectedSizeIndex ? 'primary' : 'default'}
                    onClick={() => setSelectedSizeIndex(index)}
                    disabled={!size.isAvailable}
                    sx={{ opacity: size.isAvailable ? 1 : 0.4 }}
                  />
                ))}
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('shop.noVariants')}
            </Typography>
          )}

          {variantCaption && (
            <Typography variant="caption" color="text.secondary">
              {variantCaption}
            </Typography>
          )}

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <KepcoinValue
              value={t('shop.kepcoinValue', { value: product.kepcoin })}
              iconSize={18}
              textVariant="body2"
              fontWeight={700}
            />
            <Typography variant="caption" color="text.secondary">
              {t('shop.totalStock', { count: product.totalStock })}
            </Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={() => setIsCheckoutOpen(true)}
            disabled={buyDisabled || !selectedSize}
          >
            {t('shop.buyNow')}
          </Button>
          {buyDisabledReason ? (
            <Typography variant="caption" color="error.main">
              {buyDisabledReason}
            </Typography>
          ) : null}
        </CardContent>
      </Card>

      <ShopCheckoutModal
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        productTitle={product.title}
        color={selectedColor}
        variant={selectedSize}
        price={product.kepcoin}
        onSuccess={handlePurchaseSuccess}
      />
    </>
  );
};

export const ShopProductCardSkeleton = () => (
  <Card elevation={0} sx={{ borderRadius: 3, height: 1 }}>
    <Stack spacing={2} p={2}>
      <Skeleton variant="rectangular" height={480} />
      <Skeleton height={24} width="70%" />
      <Skeleton height={18} width="40%" />
      <Skeleton height={18} width="55%" />
      <Skeleton height={36} />
    </Stack>
  </Card>
);

export default ShopProductCard;
