import { Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';

interface SortableListProps {
  items: string[];
  onChange: (items: string[]) => void;
}

const SortableList = ({ items, onChange }: SortableListProps) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }

    const nextItems = [...items];
    const [moved] = nextItems.splice(dragIndex, 1);
    nextItems.splice(targetIndex, 0, moved);
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
          key={`${item}-${index}`}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDrop={() => handleDrop(index)}
          onDragOver={(event) => event.preventDefault()}
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: 1,
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          <Typography variant="body2">{item}</Typography>
        </Paper>
      ))}
    </Stack>
  );
};

export default SortableList;
