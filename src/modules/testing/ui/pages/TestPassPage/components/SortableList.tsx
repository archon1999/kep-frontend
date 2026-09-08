import { Paper, Stack, Typography } from '@mui/material';
import { DragEvent, useId, useState } from 'react';
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
    return typeof payload?.scope === 'string' && Number.isInteger(payload?.index)
      ? payload
      : null;
  } catch {
    return null;
  }
};

const SortableList = ({ items, onChange, dragScope }: SortableListProps) => {
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
          key={`${item}-${items.slice(0, index).filter((value) => value === item).length}`}
          draggable
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
            px: 1.5,
            py: 1,
            borderRadius: 1,
            cursor: 'grab',
            userSelect: 'none',
            opacity: dragIndex === index ? 0.55 : 1,
          }}
        >
          <Typography variant="body2">{item}</Typography>
        </Paper>
      ))}
    </Stack>
  );
};

export default SortableList;
