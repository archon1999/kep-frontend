import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QueryHistoryMode, QueryParamConfig } from 'shared/lib/queryParams';

type QueryStateRecord = object;

type UpdateOptions = {
  history?: QueryHistoryMode;
  resetPages?: boolean;
};

type PatchArg<TState extends QueryStateRecord> =
  | Partial<TState>
  | ((prevState: TState) => Partial<TState>);

type UseRouteQueryStateOptions<TState extends QueryStateRecord> = {
  defaults: TState;
  schema: { [TKey in keyof TState]: QueryParamConfig<TState[TKey]> };
  historyByKey?: Partial<Record<keyof TState, QueryHistoryMode>>;
  pageResetKeys?: Array<keyof TState>;
  pageKeys?: Array<keyof TState>;
  enabled?: boolean;
};

const getDefaultPageKeys = <TState extends QueryStateRecord>(defaults: TState) => {
  if (Object.prototype.hasOwnProperty.call(defaults, 'page')) {
    return ['page'] as Array<keyof TState>;
  }

  return [];
};

const areValuesEqual = <TValue,>(
  config: QueryParamConfig<TValue>,
  left: TValue,
  right: TValue,
) => {
  if (typeof config.equals === 'function') {
    return config.equals(left, right);
  }

  return Object.is(left, right);
};

const buildStateFromSearchParams = <TState extends QueryStateRecord>(
  searchParams: URLSearchParams,
  defaults: TState,
  schema: UseRouteQueryStateOptions<TState>['schema'],
) => {
  const nextState = { ...defaults } as TState;

  (Object.keys(schema) as Array<keyof TState>).forEach((key) => {
    const config = schema[key];
    const paramName = config.param ?? String(key);
    const parsed = config.parse(searchParams.get(paramName));

    nextState[key] = parsed === undefined ? defaults[key] : parsed;
  });

  return nextState;
};

const useRouteQueryState = <TState extends QueryStateRecord>({
  defaults,
  schema,
  historyByKey,
  pageResetKeys = [],
  pageKeys,
  enabled = true,
}: UseRouteQueryStateOptions<TState>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const resolvedPageKeys = useMemo(
    () => pageKeys ?? getDefaultPageKeys(defaults),
    [defaults, pageKeys],
  );

  const state = useMemo(
    () =>
      enabled
        ? buildStateFromSearchParams(searchParams, defaults, schema)
        : ({ ...defaults } as TState),
    [defaults, enabled, schema, searchParams],
  );

  const patchState = useCallback(
    (patchArg: PatchArg<TState>, options?: UpdateOptions) => {
      if (!enabled) {
        return;
      }

      const patch =
        typeof patchArg === 'function' ? patchArg(state) : patchArg;
      const nextState = { ...state, ...patch } as TState;
      const changedKeys = (Object.keys(schema) as Array<keyof TState>).filter((key) => {
        const config = schema[key];
        return !areValuesEqual(config, state[key], nextState[key]);
      });

      if (!changedKeys.length) {
        return;
      }

      if (options?.resetPages !== false) {
        const shouldResetPages = pageResetKeys.some((key) => changedKeys.includes(key));

        if (shouldResetPages) {
          resolvedPageKeys.forEach((pageKey) => {
            if (changedKeys.includes(pageKey)) {
              return;
            }

            nextState[pageKey] = defaults[pageKey];
          });
        }
      }

      const finalChangedKeys = (Object.keys(schema) as Array<keyof TState>).filter((key) => {
        const config = schema[key];
        return !areValuesEqual(config, state[key], nextState[key]);
      });

      if (!finalChangedKeys.length) {
        return;
      }

      const nextSearchParams = new URLSearchParams(searchParams);

      (Object.keys(schema) as Array<keyof TState>).forEach((key) => {
        const config = schema[key];
        const paramName = config.param ?? String(key);
        const value = nextState[key];

        if (areValuesEqual(config, value, defaults[key])) {
          nextSearchParams.delete(paramName);
          return;
        }

        const serialized = config.serialize(value);
        if (serialized === null || serialized === '') {
          nextSearchParams.delete(paramName);
          return;
        }

        nextSearchParams.set(paramName, serialized);
      });

      const shouldReplace =
        options?.history === 'replace' ||
        (options?.history !== 'push' &&
          finalChangedKeys.every((key) => historyByKey?.[key] !== 'push'));

      setSearchParams(nextSearchParams, { replace: shouldReplace });
    },
    [
      defaults,
      enabled,
      historyByKey,
      pageResetKeys,
      resolvedPageKeys,
      schema,
      searchParams,
      setSearchParams,
      state,
    ],
  );

  const setField = useCallback(
    <TKey extends keyof TState>(
      key: TKey,
      value: TState[TKey],
      options?: UpdateOptions,
    ) => {
      patchState({ [key]: value } as unknown as Partial<TState>, options);
    },
    [patchState],
  );

  const resetState = useCallback(
    (keys?: Array<keyof TState>, options?: UpdateOptions) => {
      if (!keys?.length) {
        patchState({ ...defaults }, options);
        return;
      }

      patchState(
        keys.reduce((acc, key) => {
          acc[key] = defaults[key];
          return acc;
        }, {} as Partial<TState>),
        options,
      );
    },
    [defaults, patchState],
  );

  return {
    state,
    setField,
    patchState,
    resetState,
  };
};

export default useRouteQueryState;
