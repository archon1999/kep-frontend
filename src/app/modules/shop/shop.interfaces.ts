export interface Product {
  title: string;
  description: string;
  kepcoin: number;
  images: Array<{
    name: string;
    url: string;
  }>;
  colors: Array<{
    name: string;
    color: string;
    sizes: Array<{
      name: string;
      stock: number;
    }>
  }>;
}
