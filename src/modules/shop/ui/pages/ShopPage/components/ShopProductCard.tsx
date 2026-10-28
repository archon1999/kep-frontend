import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Card, IconButton, Rating, Skeleton, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { contentHeadingSx, contentInsetSx } from 'app/theme/styles/content';
import { ShopProduct, ShopProductColor } from 'modules/shop/domain/entities/product.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import MixedText from 'shared/components/common/MixedText';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import ShopCheckoutModal from './ShopCheckoutModal';

const sizesForColor = (color?: ShopProductColor) => color?.sizes ?? [];

interface ShopProductCardProps {
  product: ShopProduct;
  onPurchaseSuccess: () => Promise<void>;
}

const ShopProductCard = ({ product, onPurchaseSuccess }: ShopProductCardProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const colors = product.colors.length ? product.colors : [];
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const selectedColor = colors[selectedColorIndex] ?? colors[0];
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(() =>
    Math.max(
      0,
      sizesForColor(product.colors[0]).findIndex((size) => size.isAvailable),
    ),
  );
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const colorImages = selectedColor?.images?.length ? selectedColor.images : product.images;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentImage = colorImages[currentImageIndex];
  const sizes = selectedColor?.sizes ?? [];
  const selectedSize = sizes[selectedSizeIndex];
  const hasMultipleImages = colorImages.length > 1;
  const hasEnoughBalance = (currentUser?.kepcoin ?? 0) >= product.kepcoin;
  const buyDisabled = !selectedSize?.isAvailable || (Boolean(currentUser) && !hasEnoughBalance);
  const buyDisabledReason = !selectedSize?.isAvailable
    ? t('shop.checkout.outOfStock')
    : currentUser && !hasEnoughBalance
      ? t('shop.checkout.insufficientBalance')
      : '';

  useEffect(() => {
    setSelectedSizeIndex(
      Math.max(
        0,
        sizesForColor(colors[selectedColorIndex]).findIndex((size) => size.isAvailable),
      ),
    );
  }, [selectedColorIndex, product.colors]);

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

  const handleBuyClick = () => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Card
        component="article"
        variant="panel"
        sx={{
          height: 1,
          border: 0,
          display: 'flex',
          flexDirection: 'column',
          '&::before': { display: 'none' },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'action.hover',
            aspectRatio: '4 / 3',
            maxHeight: 280,
            borderBottom: 1,
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          {currentImage ? (
            <Box
              component="img"
              src={currentImage.url}
              alt={currentImage.name || product.title}
              loading="lazy"
              sx={{ width: 1, height: 1, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <Stack
              sx={{
                height: 1,
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
              gap={1}
            >
              <IconifyIcon icon="mdi:store-outline" fontSize={36} />
              <Typography variant="body2">{t('shop.noImage')}</Typography>
            </Stack>
          )}
          {hasMultipleImages && (
            <>
              {(['prev', 'next'] as const).map((direction) => (
                <IconButton
                  key={direction}
                  aria-label={t(`common.pagination.${direction === 'prev' ? 'previous' : 'next'}`)}
                  onClick={() => handleImageShift(direction)}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    [direction === 'prev' ? 'left' : 'right']: 12,
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.default',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 0,
                  }}
                >
                  <IconifyIcon icon={`mdi:chevron-${direction === 'prev' ? 'left' : 'right'}`} />
                </IconButton>
              ))}
              <Typography
                variant="label"
                sx={{
                  position: 'absolute',
                  right: 12,
                  bottom: 12,
                  px: 1,
                  py: 0.5,
                  bgcolor: 'background.default',
                  color: 'text.secondary',
                }}
              >
                {currentImageIndex + 1} / {colorImages.length}
              </Typography>
            </>
          )}
        </Box>
        <Stack gap={2} sx={{ ...contentInsetSx, flex: 1 }}>
          <Stack gap={1}>
            <Typography component="h2" sx={contentHeadingSx}>
              <MixedText>{product.title}</MixedText>
            </Typography>
            <Stack direction="row" gap={1} alignItems="center">
              {product.ratingCount > 0 ? (
                <>
                  <Rating
                    value={product.ratingAverage ?? 0}
                    precision={0.1}
                    size="small"
                    readOnly
                  />
                  <Typography variant="caption" color="text.secondary">
                    ({product.ratingCount})
                  </Typography>
                </>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  {t('shop.rating.empty')}
                </Typography>
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
          </Stack>
          <Box
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              pt: 2,
              display: 'grid',
              gridTemplateColumns: 'minmax(70px, auto) minmax(0, 1fr)',
              gap: 2,
              alignItems: 'start',
            }}
          >
            <Typography variant="label" color="text.secondary">
              {t('shop.colorLabel')}
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {colors.map((color, index) => (
                <Box
                  component="button"
                  type="button"
                  key={`${color.name}-${index}`}
                  onClick={() => setSelectedColorIndex(index)}
                  aria-pressed={index === selectedColorIndex}
                  aria-label={color.name}
                  title={color.name}
                  sx={{
                    width: 32,
                    height: 32,
                    p: 0.5,
                    border: 1,
                    borderColor: index === selectedColorIndex ? 'primary.main' : 'divider',
                    bgcolor: 'transparent',
                    cursor: 'pointer',
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 2,
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{ display: 'block', width: 1, height: 1, bgcolor: color.color }}
                  />
                </Box>
              ))}
            </Stack>
            <Typography variant="label" color="text.secondary">
              {t('shop.sizeLabel')}
            </Typography>
            <Stack direction="row" gap={0.75} flexWrap="wrap">
              {sizes.length ? (
                sizes.map((size, index) => (
                  <Button
                    key={`${size.name}-${index}`}
                    size="small"
                    variant="outlined"
                    color={index === selectedSizeIndex ? 'primary' : 'neutral'}
                    aria-pressed={index === selectedSizeIndex}
                    onClick={() => setSelectedSizeIndex(index)}
                    disabled={!size.isAvailable}
                    sx={{
                      minWidth: 36,
                      minHeight: 34,
                      px: 1,
                      borderRadius: 0,
                      bgcolor: index === selectedSizeIndex ? 'action.selected' : 'transparent',
                    }}
                  >
                    {size.name}
                  </Button>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('shop.noVariants')}
                </Typography>
              )}
            </Stack>
          </Box>
          {variantCaption && (
            <Typography variant="caption" color="text.secondary">
              {variantCaption}
            </Typography>
          )}
          <Stack gap={1.5} sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
              flexWrap="wrap"
            >
              <KepcoinValue value={product.kepcoin} iconSize={24} textVariant="metric" />
              <Typography variant="caption" color="text.secondary">
                {t('shop.totalStock', { count: product.totalStock })}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              onClick={handleBuyClick}
              disabled={buyDisabled || !selectedSize}
              endIcon={<IconifyIcon icon="mdi:arrow-up-right" />}
            >
              {t('shop.buyNow')}
            </Button>
            {buyDisabledReason && (
              <Typography variant="caption" color="text.secondary">
                {buyDisabledReason}
              </Typography>
            )}
          </Stack>
        </Stack>
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
  <Box sx={{ height: 1 }}>
    <Skeleton variant="rectangular" sx={{ aspectRatio: '4 / 3', maxHeight: 280 }} />
    <Stack gap={2} sx={contentInsetSx}>
      <Skeleton height={30} width="70%" />
      <Skeleton height={20} />
      <Skeleton height={70} />
      <Skeleton height={40} />
    </Stack>
  </Box>
);
export default ShopProductCard;
