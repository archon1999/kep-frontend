import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, MenuItem, Select, Stack, Tab, Tabs, Typography } from '@mui/material';
import type { SampleTestResult } from 'modules/problems/domain/entities/workspace.types';
import { ConsoleTextArea } from 'shared/components/code-workspace/ConsoleTextArea';
import ClipboardButton from 'shared/components/common/ClipboardButton';
import AttemptVerdict from 'shared/components/problems/AttemptVerdict';
import { WorkspacePane, WorkspaceToolbar } from 'shared/components/sections/common/Workspace';

type ConsoleView = 'input' | 'output' | 'answer';

interface ProblemConsoleProps {
  input: string;
  output: string;
  answer: string;
  onInputChange: (value: string) => void;
  sampleCount: number;
  selectedSampleIndex: number;
  onSampleChange: (value: number) => void;
  editorTab: 'console' | 'samples';
  onEditorTabChange: (value: 'console' | 'samples') => void;
  showSampleResultsTab: boolean;
  isDisabled: boolean;
  checkSamplesResult: SampleTestResult[];
}

const ProblemConsole = ({
  input,
  output,
  answer,
  onInputChange,
  sampleCount,
  selectedSampleIndex,
  onSampleChange,
  editorTab,
  onEditorTabChange,
  showSampleResultsTab,
  isDisabled,
  checkSamplesResult,
}: ProblemConsoleProps) => {
  const { t } = useTranslation();
  const id = useId();
  const [view, setView] = useState<ConsoleView>('input');
  useEffect(() => {
    if (output) setView('output');
  }, [output]);
  useEffect(() => {
    setView('input');
  }, [selectedSampleIndex]);
  const selected = showSampleResultsTab && editorTab === 'samples' ? 'samples' : view;
  const labels = {
    input: t('problems.detail.customInput'),
    output: t('problems.detail.yourOutput'),
    answer: t('problems.detail.expectedOutput'),
  };
  const values = { input, output, answer };

  return (
    <WorkspacePane component="section" aria-label={t('problems.detail.console')}>
      <WorkspaceToolbar sx={{ py: 0, flexWrap: 'wrap', columnGap: 1, minHeight: 48 }}>
        <Tabs
          value={selected}
          onChange={(_, value: ConsoleView | 'samples') => {
            onEditorTabChange(value === 'samples' ? 'samples' : 'console');
            if (value !== 'samples') setView(value);
          }}
          aria-label={t('problems.workspace.consoleNavigation')}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            flex: '1 1 220px',
            minWidth: 0,
            '& .MuiTab-root': { minHeight: 48, minWidth: 0, px: 1.25, fontSize: 12 },
          }}
        >
          {(Object.keys(labels) as ConsoleView[]).map((key) => (
            <Tab
              key={key}
              value={key}
              label={labels[key]}
              id={`${id}-${key}`}
              aria-controls={`${id}-panel`}
            />
          ))}
          {showSampleResultsTab && (
            <Tab
              value="samples"
              label={t('problems.detail.samplesResult')}
              id={`${id}-samples`}
              aria-controls={`${id}-panel`}
            />
          )}
        </Tabs>
        {sampleCount > 0 && (
          <Select
            size="small"
            variant="outlined"
            value={selectedSampleIndex}
            onChange={(event) => {
              onSampleChange(Number(event.target.value));
              onEditorTabChange('console');
              setView('input');
            }}
            disabled={isDisabled}
            inputProps={{ 'aria-label': t('problems.detail.sample') }}
            MenuProps={{ slotProps: { paper: { variant: 'framed' } } }}
            sx={{ my: 0.75, minWidth: 100, fontSize: 12, '& .MuiSelect-select': { py: 0.75 } }}
          >
            {Array.from({ length: sampleCount }, (_, index) => (
              <MenuItem key={index} value={index}>
                {t('problems.detail.sample')} {index + 1}
              </MenuItem>
            ))}
          </Select>
        )}
      </WorkspaceToolbar>
      <Box
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${selected}`}
        sx={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'auto' }}
      >
        {selected !== 'samples' ? (
          <>
            <ConsoleTextArea
              label={labels[selected]}
              value={values[selected]}
              onChange={(value) => {
                if (selected === 'input') onInputChange(value);
              }}
              readOnly={selected !== 'input'}
              disabled={isDisabled}
              placeholder={
                selected === 'output'
                  ? t('problems.workspace.outputPlaceholder')
                  : selected === 'input'
                    ? t('problems.workspace.inputPlaceholder')
                    : undefined
              }
            />
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <ClipboardButton text={values[selected]} iconOnly />
            </Box>
          </>
        ) : (
          <Stack>
            {!checkSamplesResult.length ? (
              <Typography color="text.secondary" sx={{ p: 3 }}>
                {t('problems.detail.noSamplesResult')}
              </Typography>
            ) : (
              checkSamplesResult.map((result, index) => (
                <Box key={index} sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="label">
                      {t('problems.detail.sample')}{' '}
                      <Typography component="span" variant="metric">
                        {index + 1}
                      </Typography>
                    </Typography>
                    {result.verdict != null && (
                      <AttemptVerdict
                        verdict={result.verdict}
                        title={result.verdictTitle ?? t('problems.detail.samplesResult')}
                      />
                    )}
                  </Stack>
                  {(Object.keys(labels) as ConsoleView[]).map((key) =>
                    result[key] ? (
                      <Box key={key} mb={1.5}>
                        <Typography variant="label" color="text.secondary">
                          {labels[key]}
                        </Typography>
                        <Box
                          component="pre"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: 13,
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'anywhere',
                            m: 0,
                            mt: 0.75,
                          }}
                        >
                          {result[key]}
                        </Box>
                      </Box>
                    ) : null,
                  )}
                </Box>
              ))
            )}
          </Stack>
        )}
      </Box>
    </WorkspacePane>
  );
};

export default ProblemConsole;
