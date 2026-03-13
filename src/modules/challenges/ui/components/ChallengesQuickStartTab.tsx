import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import KepIcon from 'shared/components/base/KepIcon';
import { Chapter } from 'modules/testing/domain/entities/chapter.entity.ts';

type QuickStartPreset = { timeSeconds: number; questionsCount: number };

type ChallengesQuickStartTabProps = {
  quickStarts: QuickStartPreset[];
  chapters?: Chapter[];
  isCreating: boolean;
  isAccepting: boolean;
  onQuickStart: (payload: QuickStartPreset) => void | Promise<void>;
  onCreateCustom: (payload: { timeSeconds: number; questionsCount: number; chapters?: number[] }) => void | Promise<void>;
};

const ChallengesQuickStartTab = ({
  quickStarts,
  chapters,
  isCreating,
  isAccepting,
  onQuickStart,
  onCreateCustom,
}: ChallengesQuickStartTabProps) => {
  const { t } = useTranslation();
  const [customCall, setCustomCall] = useState({
    timeSeconds: 40,
    questionsCount: 6,
    chapters: [] as number[],
  });

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Stack spacing={3} direction="column" height="100%">
          <Stack direction="row" spacing={1} alignItems="center">
            <KepIcon name="challenge" fontSize={26} color="primary.main" />
            <Typography variant="h6">{t('challenges.quickStartTitle')}</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {t('challenges.quickStartSubtitle')}
          </Typography>

          <Grid container spacing={1.5}>
            {quickStarts.map((item) => (
              <Grid
                key={`${item.timeSeconds}-${item.questionsCount}`}
                size={{ xs: 12, md: 6, lg: 3 }}
              >
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={() => onQuickStart(item)}
                  disabled={isCreating || isAccepting}
                  sx={{
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    minHeight: 72,
                    backgroundColor: 'primary.main',
                  }}
                >
                  <Stack direction="column" spacing={0.25} alignItems="flex-start">
                    <Typography variant="subtitle2" fontWeight={800}>
                      {t('challenges.quickStartButton', item)}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="primary.contrastText"
                      sx={{ opacity: 0.8 }}
                    >
                      {t('challenges.timeLimitShort', { seconds: item.timeSeconds })}
                    </Typography>
                  </Stack>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stack spacing={0.5} direction="column">
              <Typography variant="subtitle1" fontWeight={700}>
                {t('challenges.customChallenge')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('challenges.quickStartSubtitle')}
              </Typography>
            </Stack>

            <Stack spacing={1.5} direction="column">
              <Stack spacing={0.5} direction="column">
                <Typography variant="overline" color="text.secondary">
                  {t('challenges.questions')}
                </Typography>
                <Slider
                  value={customCall.questionsCount}
                  min={4}
                  max={10}
                  step={1}
                  valueLabelDisplay="on"
                  onChange={(_, value) =>
                    setCustomCall((prev) => ({ ...prev, questionsCount: value as number }))
                  }
                />
              </Stack>

              <Stack spacing={0.5} direction="column">
                <Typography variant="overline" color="text.secondary">
                  {t('challenges.timeLimit')}
                </Typography>
                <Slider
                  value={customCall.timeSeconds}
                  min={10}
                  max={90}
                  step={10}
                  valueLabelDisplay="on"
                  onChange={(_, value) =>
                    setCustomCall((prev) => ({ ...prev, timeSeconds: value as number }))
                  }
                />
              </Stack>

              <Stack spacing={0.5} direction="column">
                <Typography variant="overline" color="text.secondary">
                  {t('challenges.chapters')}
                </Typography>
                <Select
                  multiple
                  fullWidth
                  size="small"
                  value={customCall.chapters}
                  onChange={(event) =>
                    setCustomCall((prev) => ({
                      ...prev,
                      chapters:
                        typeof event.target.value === 'string'
                          ? event.target.value.split(',').map(Number)
                          : (event.target.value as number[]),
                    }))
                  }
                  renderValue={(selected) => (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {(selected as number[]).map((value) => {
                        const chapter = chapters?.find((item) => item.id === value);
                        return (
                          <Chip
                            key={value}
                            size="small"
                            label={chapter?.title ?? value}
                            variant="soft"
                          />
                        );
                      })}
                    </Stack>
                  )}
                >
                  {(chapters ?? []).map((chapter) => (
                    <MenuItem key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>

            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={() => onCreateCustom(customCall)}
                disabled={isCreating}
              >
                {t('challenges.createCall')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChallengesQuickStartTab;
