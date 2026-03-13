import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { useSWRConfig } from 'swr';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useShopProducts } from 'modules/shop/application/queries';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ShopProductCard, { ShopProductCardSkeleton } from '../components/ShopProductCard';

const ShopPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { mutate } = useSWRConfig();
  const { data: products, isLoading, error, mutate: mutateProducts } = useShopProducts();

  const showEmptyState = !isLoading && !products?.length && !error;

  const handlePurchaseSuccess = async () => {
    await Promise.all([
      mutateProducts?.(),
      mutate(['shop-orders']),
    ]);

    if (currentUser?.username) {
      navigate(getResourceByUsername(resources.UserProfilePurchases, currentUser.username));
    }
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          {t('shop.title')}
        </Typography>

        {showEmptyState ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              borderRadius: 3,
              border: (theme) => `1px dashed ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {t('shop.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('shop.emptySubtitle')}
            </Typography>
          </Box>
        ) : (
          <Box
            display="grid"
            gap={3}
            sx={{
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
            }}
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, idx) => <ShopProductCardSkeleton key={idx} />)
              : products?.map((product) => (
                  <ShopProductCard
                    key={`${product.id}-${product.title}`}
                    product={product}
                    onPurchaseSuccess={handlePurchaseSuccess}
                  />
                ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ShopPage;
