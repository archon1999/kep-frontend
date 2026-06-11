import { KeyboardEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  InputAdornment,
  Menu,
  Stack,
  Typography,
  alpha,
  formLabelClasses,
  useTheme,
} from '@mui/material';
import { ProblemGroup } from 'modules/problems/domain/entities/problem.entity.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import StyledTextField from 'shared/components/styled/StyledTextField.tsx';

interface CatalogFilterProps {
  groups: ProblemGroup[];
  value?: number[];
  onChange: (value: number[]) => void;
}

interface CatalogTreeIndex {
  byId: Map<number, ProblemGroup>;
  leafIdsByGroup: Map<number, number[]>;
}

const sameIds = (left: number[], right: number[]) => {
  if (left.length !== right.length) return false;

  const leftSorted = [...left].sort((a, b) => a - b);
  const rightSorted = [...right].sort((a, b) => a - b);

  return leftSorted.every((id, index) => id === rightSorted[index]);
};

const buildCatalogTreeIndex = (groups: ProblemGroup[]): CatalogTreeIndex => {
  const byId = new Map<number, ProblemGroup>();
  const leafIdsByGroup = new Map<number, number[]>();

  const visit = (group: ProblemGroup): number[] => {
    byId.set(group.id, group);

    const children = group.children ?? [];
    const leafIds =
      children.length === 0 ? [group.id] : children.flatMap((child) => visit(child));

    leafIdsByGroup.set(group.id, leafIds);
    return leafIds;
  };

  groups.forEach((group) => visit(group));
  return { byId, leafIdsByGroup };
};

const expandSelectionToLeafIds = (selectedIds: number[], index: CatalogTreeIndex) => {
  const leafIds = new Set<number>();

  selectedIds.forEach((selectedId) => {
    const selectedLeafIds = index.leafIdsByGroup.get(selectedId);
    selectedLeafIds?.forEach((leafId) => leafIds.add(leafId));
  });

  return leafIds;
};

const compressLeafSelection = (
  groups: ProblemGroup[],
  selectedLeafIds: Set<number>,
  explicitSelectedIds = new Set<number>(),
) => {
  const compressGroup = (group: ProblemGroup): { isFullySelected: boolean; ids: number[] } => {
    const children = group.children ?? [];

    if (explicitSelectedIds.has(group.id)) {
      return { isFullySelected: true, ids: [group.id] };
    }

    if (children.length === 0) {
      return {
        isFullySelected: selectedLeafIds.has(group.id),
        ids: selectedLeafIds.has(group.id) ? [group.id] : [],
      };
    }

    const childResults = children.map((child) => compressGroup(child));
    const isFullySelected = childResults.every((result) => result.isFullySelected);

    return {
      isFullySelected,
      ids:
        isFullySelected && children.length > 1
          ? [group.id]
          : childResults.flatMap((result) => result.ids),
    };
  };

  return groups.flatMap((group) => compressGroup(group).ids);
};

const CatalogFilter = ({ groups, value = [], onChange }: CatalogFilterProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const index = useMemo(() => buildCatalogTreeIndex(groups), [groups]);
  const normalizedValue = useMemo(
    () => compressLeafSelection(groups, expandSelectionToLeafIds(value, index), new Set(value)),
    [groups, index, value],
  );
  const selectedLeafIds = useMemo(
    () => expandSelectionToLeafIds(normalizedValue, index),
    [index, normalizedValue],
  );
  const open = Boolean(anchor);

  useEffect(() => {
    if (!sameIds(value, normalizedValue)) {
      onChange(normalizedValue);
    }
  }, [normalizedValue, onChange, value]);

  const summary = useMemo(() => {
    if (normalizedValue.length === 0) {
      return t('problems.allGroups');
    }

    const names = normalizedValue
      .map((groupId) => index.byId.get(groupId)?.name)
      .filter((name): name is string => Boolean(name));

    if (names.length === 0) {
      return t('problems.appliedFilters', { count: normalizedValue.length });
    }

    if (names.length <= 2) {
      return names.join(', ');
    }

    return `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
  }, [index.byId, normalizedValue, t]);

  const toggleAnchor = (event: MouseEvent<HTMLElement>) => {
    setAnchor((current) => (current ? null : event.currentTarget));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setAnchor((current) => (current ? null : event.currentTarget));
    }
  };

  const handleClose = () => setAnchor(null);

  const handleToggle = (groupId: number) => {
    const groupLeafIds = index.leafIdsByGroup.get(groupId) ?? [groupId];
    const nextLeafIds = new Set(selectedLeafIds);
    const isFullySelected = groupLeafIds.every((leafId) => nextLeafIds.has(leafId));

    groupLeafIds.forEach((leafId) => {
      if (isFullySelected) {
        nextLeafIds.delete(leafId);
      } else {
        nextLeafIds.add(leafId);
      }
    });

    onChange(
      compressLeafSelection(
        groups,
        nextLeafIds,
        isFullySelected ? new Set<number>() : new Set([groupId]),
      ),
    );
  };

  const handleExpandToggle = (groupId: number) => {
    setExpandedIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    );
  };

  return (
    <>
      <StyledTextField
        label={t('problems.groups')}
        value={summary}
        fullWidth
        onClick={toggleAnchor}
        onKeyDown={handleKeyDown}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconifyIcon
                  icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                  color={theme.palette.text.secondary}
                />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          [`& .${formLabelClasses.root}`]: { color: 'text.primary' },
          '& .MuiInputBase-root': { cursor: 'pointer' },
          '& .MuiInputBase-input': {
            cursor: 'pointer',
            textOverflow: 'ellipsis',
          },
        }}
      />

      <Menu
        id="problems-catalog-menu"
        anchorEl={anchor}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        MenuListProps={{ disablePadding: true }}
        PaperProps={{
          sx: {
            mt: 1,
            width: { xs: 280, sm: 420 },
            maxHeight: 520,
            p: 1,
            overflow: 'hidden',
          },
        }}
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1, pt: 0.5 }}
          >
            <Stack spacing={0.25}>
              <Typography variant="subtitle2" fontWeight={700}>
                {t('problems.groups')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {normalizedValue.length > 0
                  ? t('problems.appliedFilters', { count: normalizedValue.length })
                  : summary}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {normalizedValue.length > 0 ? (
                <Button size="small" variant="text" color="secondary" onClick={() => onChange([])}>
                  {t('problems.clearFilters')}
                </Button>
              ) : null}
              <Button size="small" variant="text" color="secondary" onClick={handleClose}>
                OK
              </Button>
            </Stack>
          </Stack>

          <Divider />

          <Box sx={{ maxHeight: 430, overflowY: 'auto', pr: 0.25 }}>
            <CatalogTree
              groups={groups}
              selectedLeafIds={selectedLeafIds}
              leafIdsByGroup={index.leafIdsByGroup}
              expandedIds={expandedIds}
              onToggle={handleToggle}
              onExpandToggle={handleExpandToggle}
            />
          </Box>
        </Stack>
      </Menu>
    </>
  );
};

interface CatalogTreeProps {
  groups: ProblemGroup[];
  selectedLeafIds: Set<number>;
  leafIdsByGroup: Map<number, number[]>;
  expandedIds: number[];
  depth?: number;
  onToggle: (groupId: number) => void;
  onExpandToggle: (groupId: number) => void;
}

const CatalogTree = ({
  groups,
  selectedLeafIds,
  leafIdsByGroup,
  expandedIds,
  depth = 0,
  onToggle,
  onExpandToggle,
}: CatalogTreeProps) => {
  const theme = useTheme();

  if (groups.length === 0 && depth === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 1.5 }}>
        No catalog items
      </Typography>
    );
  }

  return (
    <Stack spacing={0.25}>
      {groups.map((group) => {
        const children = group.children ?? [];
        const hasChildren = children.length > 0;
        const leafIds = leafIdsByGroup.get(group.id) ?? [group.id];
        const selectedCount = leafIds.filter((leafId) => selectedLeafIds.has(leafId)).length;
        const isSelected = leafIds.length > 0 && selectedCount === leafIds.length;
        const isIndeterminate = selectedCount > 0 && selectedCount < leafIds.length;
        const isExpanded = expandedIds.includes(group.id);

        return (
          <Box key={group.id}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{
                minHeight: 40,
                pl: 0.5 + depth * 2,
                pr: 0.75,
                borderRadius: 1,
                bgcolor:
                  isSelected || isIndeterminate
                    ? alpha(theme.palette.primary.main, 0.08)
                    : 'transparent',
                '&:hover': {
                  bgcolor:
                    isSelected || isIndeterminate
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.text.primary, 0.04),
                },
              }}
            >
              <Button
                variant="text"
                color="secondary"
                size="small"
                disabled={!hasChildren}
                onClick={() => onExpandToggle(group.id)}
                sx={{
                  minWidth: 28,
                  width: 28,
                  height: 28,
                  p: 0,
                  visibility: hasChildren ? 'visible' : 'hidden',
                }}
              >
                <IconifyIcon
                  icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}
                  width={18}
                  height={18}
                />
              </Button>

              <Checkbox
                size="small"
                checked={isSelected}
                indeterminate={isIndeterminate}
                onChange={() => onToggle(group.id)}
                sx={{ p: 0.5 }}
              />

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ minWidth: 0, flex: 1 }}
                onClick={() => onToggle(group.id)}
              >
                <IconifyIcon
                  icon={hasChildren ? 'mdi:folder-outline' : 'mdi:file-tree-outline'}
                  width={18}
                  height={18}
                  color={
                    isSelected || isIndeterminate
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary
                  }
                />
                <Typography
                  variant="body2"
                  fontWeight={isSelected || isIndeterminate ? 700 : 500}
                  sx={{ minWidth: 0, flex: 1 }}
                  noWrap
                >
                  {group.name}
                </Typography>
                {group.problemsCount != null ? (
                  <Chip size="small" variant="outlined" label={group.problemsCount} />
                ) : null}
              </Stack>
            </Stack>

            {hasChildren ? (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <CatalogTree
                  groups={children}
                  selectedLeafIds={selectedLeafIds}
                  leafIdsByGroup={leafIdsByGroup}
                  expandedIds={expandedIds}
                  depth={depth + 1}
                  onToggle={onToggle}
                  onExpandToggle={onExpandToggle}
                />
              </Collapse>
            ) : null}
          </Box>
        );
      })}
    </Stack>
  );
};

export default CatalogFilter;
