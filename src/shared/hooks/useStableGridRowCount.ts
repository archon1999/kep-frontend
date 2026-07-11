import { useMemo, useRef } from 'react';

const useStableGridRowCount = (rowCount: number | undefined, loading = false) => {
  const rowCountRef = useRef(rowCount ?? 0);

  return useMemo(() => {
    if (rowCount !== undefined && (!loading || rowCount > 0)) {
      rowCountRef.current = rowCount;
    }

    return rowCountRef.current;
  }, [loading, rowCount]);
};

export default useStableGridRowCount;
