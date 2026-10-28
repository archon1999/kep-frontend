import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Alert, Box, Button, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import { contentGridSx } from 'app/theme/styles/content';
import { useShopPage } from 'modules/shop/application/hooks/useShopPage';
import EmptyState from 'shared/components/common/EmptyState';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ShopProductCard, { ShopProductCardSkeleton } from './components/ShopProductCard';

const ShopPage = () => {
  const {
    currentUser,
    products,
    isLoading,
    error,
    mutateProducts,
    showEmptyState,
    handlePurchaseSuccess,
  } = useShopPage();

  const { t } = useTranslation();

  return (
    <FramedPage>
      <PageHeader
        title={t('shop.title')}
        subtitle={t('shop.subtitle')}
        variant="detail"
        actionComponent={
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            {currentUser && (
              <KepcoinValue value={currentUser.kepcoin} iconSize={24} textVariant="metric" />
            )}
            <Button component={RouterLink} to={resources.Kepcoin} variant="outlined">
              {t('menu.kepcoin')}
            </Button>
          </Stack>
        }
      />
      <Stack direction="column" spacing={0}>
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" onClick={() => void mutateProducts()}>
                {t('common.retry')}
              </Button>
            }
          >
            {t('common.loadFailed')}
          </Alert>
        )}
        {showEmptyState ? (
          <EmptyState title={t('shop.emptyTitle')} description={t('shop.emptySubtitle')} />
        ) : (
          <Box
            sx={{
              ...contentGridSx,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                xl: 'repeat(3, 1fr)',
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
    </FramedPage>
  );
};

export default ShopPage;
