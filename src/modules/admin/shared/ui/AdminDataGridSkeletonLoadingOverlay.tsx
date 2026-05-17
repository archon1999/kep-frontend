import { ComponentProps, forwardRef } from 'react';
import { GridSkeletonLoadingOverlayInner } from '@mui/x-data-grid/internals';

const ADMIN_LIST_LOADING_SKELETON_ROWS = 10;

const AdminDataGridSkeletonLoadingOverlay = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof GridSkeletonLoadingOverlayInner>
>((props, ref) => (
  <GridSkeletonLoadingOverlayInner
    {...props}
    ref={ref}
    skeletonRowsCount={ADMIN_LIST_LOADING_SKELETON_ROWS}
  />
));

AdminDataGridSkeletonLoadingOverlay.displayName = 'AdminDataGridSkeletonLoadingOverlay';

export default AdminDataGridSkeletonLoadingOverlay;
