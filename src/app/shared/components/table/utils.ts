type Primitive = string | number | boolean | bigint | symbol | null | undefined;
type IsPlainObject<T> =
  T extends Primitive ? false :
    T extends any[] ? false :
      T extends object ? true : false;

type DotPrefix<P extends string, K extends string> =
  P extends '' ? K : `${P}.${K}`;

type _ExtractKeys<
  T,
  P extends string = ''
> = {
  [K in keyof T]: IsPlainObject<T[K]> extends true
    ? DotPrefix<P, K & string> |
    _ExtractKeys<T[K], DotPrefix<P, K & string>>
    : DotPrefix<P, K & string>;
}[keyof T];

export type ExtractKeys<T> = _ExtractKeys<T> | 'actions';

export const getByPath = (obj: any, path: string): any =>
  path.split('.').reduce((a, p) => (a ?? {})[p], obj);
