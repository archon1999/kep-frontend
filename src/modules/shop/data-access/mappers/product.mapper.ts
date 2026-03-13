import {
  ShopProduct,
  ShopProductColor,
  ShopProductImage,
  ShopProductSize,
} from '../../domain/entities/product.entity';

type ShopApiColor = {
  name: string;
  color: string;
  images?: Array<{ name?: string; url: string }>;
  sizes?: Array<{
    name: string;
    stock: number;
    variant_id?: number;
    variantId?: number;
    is_available?: boolean;
    isAvailable?: boolean;
  }>;
};

type ShopApiProduct = {
  id: number;
  title: string;
  description: string;
  kepcoin: number;
  images?: Array<{ name?: string; url: string }>;
  colors?: ShopApiColor[] | null;
  total_stock?: number;
  totalStock?: number;
  rating_average?: number | null;
  ratingAverage?: number | null;
  rating_count?: number;
  ratingCount?: number;
};

const normalizeImages = (images?: Array<{ name?: string; url: string }>): ShopProductImage[] => {
  if (!images?.length) {
    return [];
  }

  return images
    .filter((image): image is { name?: string; url: string } => Boolean(image?.url))
    .map((image) => ({
      url: image.url,
      name: image.name,
    }));
};

const normalizeSizes = (
  sizes?: Array<{
    name: string;
    stock: number;
    variant_id?: number;
    variantId?: number;
    is_available?: boolean;
    isAvailable?: boolean;
  }>,
): ShopProductSize[] =>
  (sizes ?? []).map((size) => ({
    name: size.name,
    stock: size.stock,
    variantId: size.variantId ?? size.variant_id ?? 0,
    isAvailable: Boolean(size.isAvailable ?? size.is_available),
  }));

const normalizeColors = (colors?: ShopApiColor[] | null): ShopProductColor[] =>
  (colors ?? []).map((color) => {
    const images = normalizeImages(color.images);

    return {
      name: color.name,
      color: color.color,
      images: images.length ? images : undefined,
      sizes: normalizeSizes(color.sizes),
    };
  });

export const mapApiProductToDomain = (product: ShopApiProduct): ShopProduct => ({
  id: product.id,
  title: product.title,
  description: product.description,
  kepcoin: product.kepcoin,
  images: normalizeImages(product.images),
  colors: normalizeColors(product.colors),
  totalStock: product.totalStock ?? product.total_stock ?? 0,
  ratingAverage: product.ratingAverage ?? product.rating_average ?? null,
  ratingCount: product.ratingCount ?? product.rating_count ?? 0,
});
