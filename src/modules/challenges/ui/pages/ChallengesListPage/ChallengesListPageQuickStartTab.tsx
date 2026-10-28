import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, MenuItem, Select, Slider, Stack, Typography } from '@mui/material';
import { Chapter } from 'modules/testing/domain/entities/chapter.entity';
import KepIcon from 'shared/components/base/KepIcon';
import ChapterLogo from 'shared/components/common/ChapterLogo';
import PatternArtwork from 'shared/components/common/PatternArtwork';

type QuickStartPreset = { timeSeconds: number; questionsCount: number };
type ChallengesListPageQuickStartTabProps = {
  quickStarts: QuickStartPreset[];
  chapters?: Chapter[];
  isCreating: boolean;
  isAccepting: boolean;
  onQuickStart: (payload: QuickStartPreset) => void | Promise<void>;
  onCreateCustom: (payload: QuickStartPreset & { chapters?: number[] }) => void | Promise<void>;
};
const ChallengesListPageQuickStartTab = ({
  quickStarts,
  chapters,
  isCreating,
  isAccepting,
  onQuickStart,
  onCreateCustom,
}: ChallengesListPageQuickStartTabProps) => {
  const { t } = useTranslation();
  const [customCall, setCustomCall] = useState({
    timeSeconds: 40,
    questionsCount: 6,
    chapters: [] as number[],
  });
  const busy = isCreating || isAccepting;
  return (
    <Stack direction="column" gap={4}>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Stack gap={0.75}>
            <Typography component="h2" variant="h6">
              {t('challenges.quickStartTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('challenges.quickStartSubtitle')}
            </Typography>
          </Stack>
          <PatternArtwork kind="battles" sx={{ width: { xs: 88, sm: 140 }, flexShrink: 0 }} />
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 1.5,
            mt: 2,
          }}
        >
          {quickStarts.map((item) => (
            <Button
              key={`${item.timeSeconds}-${item.questionsCount}`}
              variant="outlined"
              onClick={() => onQuickStart(item)}
              disabled={busy}
              aria-label={t('challenges.presetLabel', item)}
              sx={{
                borderRadius: 0,
                p: 2.5,
                justifyContent: 'space-between',
                gap: 1,
                textAlign: 'left',
              }}
            >
              <Stack gap={0.5} alignItems="flex-start">
                <Typography
                  component="span"
                  variant="metric"
                  sx={{ fontSize: 32, color: 'text.primary' }}
                >
                  {t('challenges.secondsShort', { seconds: item.timeSeconds })}
                </Typography>
                <Typography component="span" variant="body2" color="text.secondary">
                  {t('challenges.questionsCount', { count: item.questionsCount })}
                </Typography>
              </Stack>
              <KepIcon name="challenge" fontSize={24} />
            </Button>
          ))}
        </Box>
      </Box>
      <Box sx={{ pt: 3, borderTop: 1, borderColor: 'divider' }}>
        <Stack gap={0.75} sx={{ mb: 3 }}>
          <Typography component="h2" variant="h6">
            {t('challenges.customChallenge')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('challenges.customDescription')}
          </Typography>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
            columnGap: 5,
            rowGap: 2,
          }}
        >
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
              <Typography variant="body2" id="challenge-questions-label">
                {t('challenges.questions')}
              </Typography>
              <Typography variant="metric" sx={{ fontSize: 22 }}>
                {customCall.questionsCount}
              </Typography>
            </Stack>
            <Slider
              aria-labelledby="challenge-questions-label"
              value={customCall.questionsCount}
              min={4}
              max={10}
              step={1}
              marks
              disabled={busy}
              valueLabelDisplay="auto"
              onChange={(_, value) =>
                setCustomCall((prev) => ({ ...prev, questionsCount: value as number }))
              }
            />
          </Box>
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
              <Typography variant="body2" id="challenge-time-label">
                {t('challenges.timeLimit')}
              </Typography>
              <Typography variant="metric" sx={{ fontSize: 22 }}>
                {t('challenges.secondsShort', { seconds: customCall.timeSeconds })}
              </Typography>
            </Stack>
            <Slider
              aria-labelledby="challenge-time-label"
              value={customCall.timeSeconds}
              min={10}
              max={90}
              step={10}
              marks
              disabled={busy}
              valueLabelDisplay="auto"
              getAriaValueText={(value) => t('challenges.secondsShort', { seconds: value })}
              onChange={(_, value) =>
                setCustomCall((prev) => ({ ...prev, timeSeconds: value as number }))
              }
            />
          </Box>
        </Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={2}
          alignItems={{ sm: 'flex-end' }}
          sx={{ mt: 1 }}
        >
          <Stack gap={1} sx={{ flex: 1, minWidth: 0 }}>
            <Typography component="label" id="challenge-chapters-label" variant="body2">
              {t('challenges.chapters')}
            </Typography>
            <Select
              multiple
              fullWidth
              displayEmpty
              size="small"
              labelId="challenge-chapters-label"
              disabled={busy}
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
              renderValue={(selected) =>
                selected.length ? (
                  <Stack direction="row" gap={0.5} flexWrap="wrap" useFlexGap>
                    {selected.map((value) => {
                      const chapter = chapters?.find((item) => item.id === value);
                      return chapter ? (
                        <ChapterLogo key={value} chapter={chapter} size={24} focusable={false} />
                      ) : (
                        <Typography key={value} variant="caption">
                          {value}
                        </Typography>
                      );
                    })}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('challenges.allChapters')}
                  </Typography>
                )
              }
            >
              {(chapters ?? []).map((chapter) => (
                <MenuItem key={chapter.id} value={chapter.id} sx={{ gap: 1.5 }}>
                  <ChapterLogo chapter={chapter} size={24} focusable={false} />
                  {chapter.title}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <Button
            variant="contained"
            onClick={() => onCreateCustom(customCall)}
            disabled={busy}
            sx={{ minHeight: 40 }}
            startIcon={<KepIcon name="challenge" fontSize={18} />}
          >
            {t('challenges.createCall')}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};
export default ChallengesListPageQuickStartTab;
