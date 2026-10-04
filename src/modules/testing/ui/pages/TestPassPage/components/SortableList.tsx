import { DragEvent, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { reorderItems } from '../dragAndDrop';

interface SortableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  dragScope?: string;
}

interface SortableDragPayload {
  scope: string;
  index: number;
}

const getDragPayload = (event: DragEvent): SortableDragPayload | null => {
  try {
    const payload = JSON.parse(event.dataTransfer.getData('text/plain')) as SortableDragPayload;
    return typeof payload?.scope === 'string' && Number.isInteger(payload?.index) ? payload : null;
  } catch {
    return null;
  }
};

const SortableList = ({ items, onChange, dragScope }: SortableListProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isTouchDevice = useMediaQuery('(pointer: coarse)');
  const canDrag = !isSmallScreen && !isTouchDevice;
  const generatedScope = useId();
  const scope = dragScope ?? generatedScope;
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (event: DragEvent, index: number) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({ scope, index }));
    setDragIndex(index);
  };

  const handleDrop = (event: DragEvent, targetIndex: number) => {
    event.preventDefault();
    event.stopPropagation();
    const payload = getDragPayload(event);
    if (!payload || payload.scope !== scope) {
      return;
    }

    const nextItems = reorderItems(items, payload.index, targetIndex);
    if (nextItems === items) {
      setDragIndex(null);
      return;
    }

    setDragIndex(null);
    onChange(nextItems);
  };

  return (
    <Stack
      component="ul"
      spacing={1}
      sx={{ listStyle: 'none', p: 0, m: 0, minWidth: 0 }}
      onDragOver={(event) => event.preventDefault()}
    >
      {items.map((item, index) => (
        <Paper
          component="li"
          variant="outlined"
          key={`${item}-${items.slice(0, index).filter((value) => value === item).length}`}
          draggable={canDrag}
          onDragStart={(event) => handleDragStart(event, index)}
          onDragEnd={() => setDragIndex(null)}
          onDrop={(event) => handleDrop(event, index)}
          onDragOver={(event) => {
            if (dragIndex !== null) {
              event.preventDefault();
              event.stopPropagation();
              event.dataTransfer.dropEffect = 'move';
            }
          }}
          sx={{
            px: { xs: 1.25, sm: 2 },
            py: { xs: 0.75, sm: 1.25 },
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: 'transparent',
            cursor: canDrag ? 'grab' : 'default',
            '&:active': { cursor: canDrag ? 'grabbing' : 'default' },
            userSelect: 'none',
            opacity: dragIndex === index ? 0.55 : 1,
          }}
        >
          <IconifyIcon
            icon="material-symbols:drag-indicator-rounded"
            sx={{
              color: 'text.disabled',
              fontSize: 20,
              flexShrink: 0,
              display: canDrag ? 'block' : 'none',
            }}
          />
          <Typography variant="body1" sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
            {item}
          </Typography>
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton
              color="default"
              aria-label={t('tests.moveUp', { item })}
              disabled={index === 0}
              onClick={() => onChange(reorderItems(items, index, index - 1))}
              sx={{ width: 44, height: 44, color: 'text.secondary' }}
            >
              <IconifyIcon
                icon="material-symbols:keyboard-arrow-up-rounded"
                sx={{ fontSize: 22 }}
              />
            </IconButton>
            <IconButton
              color="default"
              aria-label={t('tests.moveDown', { item })}
              disabled={index === items.length - 1}
              onClick={() => onChange(reorderItems(items, index, index + 1))}
              sx={{ width: 44, height: 44, color: 'text.secondary' }}
            >
              <IconifyIcon
                icon="material-symbols:keyboard-arrow-down-rounded"
                sx={{ fontSize: 22 }}
              />
            </IconButton>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default SortableList;
