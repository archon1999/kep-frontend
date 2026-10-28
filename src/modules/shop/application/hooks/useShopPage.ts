import { useNavigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useShopProducts } from 'modules/shop/application/queries';
import { useSWRConfig } from 'swr';

export const useShopPage = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const { mutate } = useSWRConfig();

  const { data: products, isLoading, error, mutate: mutateProducts } = useShopProducts();

  const showEmptyState = !isLoading && !products?.length && !error;

  const handlePurchaseSuccess = async () => {
    await Promise.all([mutateProducts?.(), mutate(['shop-orders'])]);

    if (currentUser?.username) {
      navigate(getResourceByUsername(resources.UserProfilePurchases, currentUser.username));
    }
  };
  return {
    currentUser,
    products,
    isLoading,
    error,
    mutateProducts,
    showEmptyState,
    handlePurchaseSuccess,
  };
};
