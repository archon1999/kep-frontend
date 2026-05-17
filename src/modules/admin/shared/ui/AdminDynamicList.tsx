import { Fragment, ReactNode } from 'react';

interface AdminDynamicListProps<T> {
  items: T[];
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number, remove: (index: number) => void) => ReactNode;
  renderEmpty?: ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
}

const AdminDynamicList = <T,>({
  items,
  onRemove,
  renderItem,
  renderEmpty,
  getItemKey,
}: AdminDynamicListProps<T>) =>
  items.length ? (
    <>
      {items.map((item, index) => (
        <Fragment key={getItemKey ? getItemKey(item, index) : index}>
          {renderItem(item, index, onRemove)}
        </Fragment>
      ))}
    </>
  ) : (
    <>{renderEmpty}</>
  );

export default AdminDynamicList;
