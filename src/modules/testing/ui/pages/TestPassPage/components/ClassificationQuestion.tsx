import { DragEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { DragLocation, moveClassificationItem } from '../dragAndDrop';
import { ClassificationGroup, TestPassQuestion } from '../types';
import QuestionHeader from './QuestionHeader';

interface ClassificationQuestionProps {
  question: TestPassQuestion;
  groups: ClassificationGroup[];
  onChange: (groups: ClassificationGroup[]) => void;
}

const ClassificationQuestion = ({ question, groups, onChange }: ClassificationQuestionProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isTouchDevice = useMediaQuery('(pointer: coarse)');
  const useGroupSelectors = isSmallScreen || isTouchDevice;
  const [dragSource, setDragSource] = useState<DragLocation | null>(null);

  const locations = new Map<string, DragLocation[]>();
  groups.forEach((group, groupIndex) => {
    group.values.forEach((value, itemIndex) => {
      const matches = locations.get(value) ?? [];
      matches.push({ groupIndex, itemIndex });
      locations.set(value, matches);
    });
  });
  const entries: Array<{ key: string; value: string; source: DragLocation }> = [];
  (question.options ?? []).forEach((option, index) => {
    const value = option.optionSecondary ?? '';
    const source = locations.get(value)?.shift();
    if (source) {
      entries.push({ key: `option-${option.id ?? index}`, value, source });
    }
  });
  locations.forEach((remaining, value) => {
    remaining.forEach((source) =>
      entries.push({ key: `extra-${source.groupIndex}-${source.itemIndex}`, value, source }),
    );
  });

  const handleDrop = (event: DragEvent, targetGroupIndex: number, targetIndex?: number) => {
    event.preventDefault();
    event.stopPropagation();
    if (!dragSource) {
      return;
    }

    const updated = moveClassificationItem(groups, dragSource, targetGroupIndex, targetIndex);
    setDragSource(null);
    if (updated !== groups) {
      onChange(updated);
    }
  };

  return (
    <Stack direction="column" spacing={3}>
      <QuestionHeader question={question} />
      {useGroupSelectors ? (
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            {t('tests.classificationHint')}
          </Typography>
          {entries.map(({ key, value, source }) => (
            <Stack
              key={key}
              spacing={1.5}
              sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
            >
              <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
                {value}
              </Typography>
              <TextField
                select
                fullWidth
                label={t('tests.chooseGroup')}
                value={source.groupIndex}
                onChange={(event) => {
                  const target = Number(event.target.value);
                  if (target === source.groupIndex) return;
                  const updated = moveClassificationItem(groups, source, target);
                  if (updated !== groups) onChange(updated);
                }}
                slotProps={{
                  select: {
                    inputProps: { 'aria-label': t('tests.moveToGroup', { item: value }) },
                    MenuProps: {
                      PaperProps: { sx: { maxHeight: 320, maxWidth: 'calc(100% - 32px)' } },
                    },
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': { minHeight: 48 },
                  '& .MuiSelect-select': {
                    whiteSpace: 'normal',
                    overflowWrap: 'anywhere',
                    lineHeight: 1.5,
                    py: 1.25,
                    fontSize: 16,
                  },
                }}
              >
                {groups.map((group, groupIndex) => (
                  <MenuItem
                    key={groupIndex}
                    value={groupIndex}
                    sx={{ minHeight: 44, whiteSpace: 'normal', overflowWrap: 'anywhere' }}
                  >
                    {group.key || t('tests.groupLabel', { number: groupIndex + 1 })}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Stack direction="column" spacing={2}>
          {groups.map((group, groupIndex) => (
            <Stack
              key={`${group.key}-${groupIndex}`}
              direction="column"
              spacing={1}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(event) => handleDrop(event, groupIndex)}
            >
              <Typography variant="subtitle2" fontWeight={700}>
                {group.key || t('tests.groupLabel', { number: groupIndex + 1 })}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {group.values.map((value, valueIndex) => (
                  <Paper
                    variant="outlined"
                    key={`${value}-${group.values.slice(0, valueIndex).filter((item) => item === value).length}`}
                    draggable
                    onDragStart={(event) => {
                      event.stopPropagation();
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', 'classification-item');
                      setDragSource({ groupIndex, itemIndex: valueIndex });
                    }}
                    onDragEnd={() => setDragSource(null)}
                    onDrop={(event) => handleDrop(event, groupIndex, valueIndex)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      event.dataTransfer.dropEffect = 'move';
                    }}
                    sx={{
                      px: 1.25,
                      py: 1,
                      cursor: 'grab',
                      display: 'flex',
                      gap: 0.75,
                      alignItems: 'center',
                      maxWidth: '100%',
                      borderRadius: 1.5,
                      bgcolor: 'transparent',
                      '&:active': { cursor: 'grabbing' },
                      userSelect: 'none',
                    }}
                  >
                    <IconifyIcon
                      icon="material-symbols:drag-indicator-rounded"
                      sx={{ fontSize: 18, color: 'text.disabled', flexShrink: 0 }}
                    />
                    <Typography variant="body2" sx={{ overflowWrap: 'anywhere', minWidth: 0 }}>
                      {value}
                    </Typography>
                  </Paper>
                ))}
                {!group.values.length ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      px: 1.25,
                      py: 1,
                      borderStyle: 'dashed',
                      color: 'text.secondary',
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      event.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(event) => handleDrop(event, groupIndex)}
                  >
                    <Typography variant="caption">{t('tests.dropHere')}</Typography>
                  </Paper>
                ) : null}
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default ClassificationQuestion;
