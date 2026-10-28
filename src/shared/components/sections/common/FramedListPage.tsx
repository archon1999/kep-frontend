import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import {
  Box,
  Button,
  Pagination,
  PaginationItem,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import EmptyState from 'shared/components/common/EmptyState';
import type { PatternArtworkKind } from 'shared/components/common/PatternArtwork';
import { getPageHref } from 'shared/lib/paginationLinks';
import FramedPage from './FramedPage';

export const ListToolbar = ({ children, caption }: PropsWithChildren<{ caption?: ReactNode }>) => (
  <Stack
    direction="row"
    sx={{
      px: 'var(--kep-content-inset)',
      py: 2,
      gap: 2,
      minHeight: 72,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      borderBottom: 1,
      borderColor: 'divider',
    }}
  >
    {children}
    {caption && (
      <Typography variant="body2" color="text.secondary">
        {caption}
      </Typography>
    )}
  </Stack>
);

export const ListPagination = ({
  page,
  count,
  onChange,
  disabled,
  pageHref,
}: {
  page: number;
  count: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  pageHref?: (page: number) => string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const visible = count > 1;
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Sidebars and multi-column lists can be narrow even on a wide screen.
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(container);
    return () => observer.disconnect();
  }, [visible]);
  if (count <= 1) return null;
  return (
    <Stack
      ref={containerRef}
      direction="row"
      justifyContent="center"
      sx={{ width: '100%', minWidth: 0, px: 1, py: 3 }}
    >
      <Pagination
        count={count}
        page={page}
        disabled={disabled}
        onChange={(_, value) => onChange(value)}
        siblingCount={width < 460 ? 0 : 1}
        boundaryCount={width < 320 ? 0 : 1}
        color="primary"
        renderItem={(item) => {
          if (!pageHref || item.disabled || item.page === null || item.type.endsWith('ellipsis'))
            return <PaginationItem {...item} />;
          return (
            <PaginationItem
              {...item}
              component="a"
              href={pageHref(item.page)}
              onClick={(event) => {
                // Preserve open-in-new-tab and modified clicks; ordinary clicks
                // keep the existing query-state update and scroll behavior.
                if (
                  event.button ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                item.onClick(event);
              }}
            />
          );
        }}
      />
    </Stack>
  );
};

/** For lists whose page is stored in the URL. Dialog/local pagination stays a button. */
export const RouteListPagination = (props: Parameters<typeof ListPagination>[0]) => {
  const { pathname, search } = useLocation();
  return <ListPagination {...props} pageHref={(page) => getPageHref(pathname, search, page)} />;
};

export const ListFeedback = ({
  loading,
  error,
  empty,
  emptyTitle,
  emptyMessage,
  errorMessage,
  kind = 'empty',
  onRetry,
  loadingContent,
}: {
  loading: boolean;
  error?: unknown;
  empty: boolean;
  emptyTitle: string;
  emptyMessage: string;
  errorMessage: string;
  kind?: PatternArtworkKind;
  onRetry?: () => void;
  loadingContent?: ReactNode;
}) => {
  const { t } = useTranslation();
  if (error)
    return (
      <Box role="alert">
        <EmptyState
          kind="error"
          title={errorMessage}
          compact
          action={
            onRetry ? (
              <Button variant="outlined" onClick={onRetry}>
                {t('common.retry')}
              </Button>
            ) : undefined
          }
        />
      </Box>
    );
  if (loading)
    return (
      loadingContent ?? (
        <Stack direction="column" gap={0}>
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} variant="rectangular" height={260} />
          ))}
        </Stack>
      )
    );
  if (!empty) return null;
  return <EmptyState kind={kind} title={emptyTitle} description={emptyMessage} />;
};

export default FramedPage;
