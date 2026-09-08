import type { ClassificationGroup } from './types.ts';

export interface DragLocation {
  groupIndex: number;
  itemIndex: number;
}

export const reorderItems = <T>(items: T[], sourceIndex: number, targetIndex: number): T[] => {
  if (
    sourceIndex < 0 ||
    sourceIndex >= items.length ||
    targetIndex < 0 ||
    targetIndex >= items.length ||
    sourceIndex === targetIndex
  ) {
    return items;
  }

  const reordered = [...items];
  const [moved] = reordered.splice(sourceIndex, 1);
  reordered.splice(targetIndex, 0, moved);
  return reordered;
};

export const moveClassificationItem = (
  groups: ClassificationGroup[],
  source: DragLocation,
  targetGroupIndex: number,
  targetItemIndex?: number,
): ClassificationGroup[] => {
  const sourceGroup = groups[source.groupIndex];
  const targetGroup = groups[targetGroupIndex];
  if (
    !sourceGroup ||
    !targetGroup ||
    source.itemIndex < 0 ||
    source.itemIndex >= sourceGroup.values.length
  ) {
    return groups;
  }

  const updated = groups.map((group) => ({ ...group, values: [...group.values] }));
  const [moved] = updated[source.groupIndex].values.splice(source.itemIndex, 1);
  const targetValues = updated[targetGroupIndex].values;
  const insertionIndex =
    typeof targetItemIndex === 'number'
      ? Math.max(0, Math.min(targetItemIndex, targetValues.length))
      : targetValues.length;

  targetValues.splice(insertionIndex, 0, moved);
  return updated;
};
