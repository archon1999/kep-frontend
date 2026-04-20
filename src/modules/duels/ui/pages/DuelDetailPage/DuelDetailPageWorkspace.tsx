import { Box, Card, CardContent, Chip, Divider, LinearProgress, Stack, Tab, Tabs, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { GridPaginationModel } from '@mui/x-data-grid';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useTranslation } from 'react-i18next';
import { Duel, DuelPlayer, DuelProblem } from 'modules/duels/domain/index.ts';
import ProblemsAttemptsTable from 'modules/problems/ui/shared/components/ProblemsAttemptsTable.tsx';
import { PanelHandle } from 'modules/problems/ui/shared/components/problem-detail/PanelHandles';
import { ProblemBody } from 'modules/problems/ui/shared/components/problem-detail/ProblemBody';
import ProblemDescriptionSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemDescriptionSkeleton';
import { ProblemEditorPanel } from 'modules/problems/ui/shared/components/problem-detail/ProblemEditorPanel';
import ProblemEditorSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemEditorSkeleton';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DuelDetailPageResultsFooter, {
  DuelDetailPageNavigationProblem,
  DuelDetailPageWorkspaceView,
} from './components/DuelDetailPageResultsFooter.tsx';

type WorkspaceTab = 'description' | 'attempts';

type StandingRow = {
  key: string;
  order: number;
  accent: 'primary' | 'secondary';
  player: DuelPlayer;
  total: number;
  rank: number;
};

type Props = {
  duel: Duel;
  isLoading: boolean;
  isValidating: boolean;
  view: DuelDetailPageWorkspaceView;
  activeTab: WorkspaceTab;
  navigationProblems: DuelDetailPageNavigationProblem[];
  activeNavigationProblem: DuelDetailPageNavigationProblem | null;
  activeProblem: DuelProblem | null;
  standingsRows: StandingRow[];
  maxScore: number;
  isAuthenticated: boolean;
  attempts: any[];
  attemptsTotal: number;
  attemptsPagination: GridPaginationModel;
  onAttemptsPaginationChange: (model: GridPaginationModel) => void;
  isAttemptsLoading: boolean;
  workspaceAttemptLink: string;
  onRefreshAttempts: () => void;
  onChangeView: (view: DuelDetailPageWorkspaceView) => void;
  onChangeTab: (tab: WorkspaceTab) => void;
  onSelectProblem: (symbol: string) => void;
  initialCode: string;
  editorKey: string;
  onCodeChange: (value: string) => void;
  selectedLang: string;
  onLangChange: (value: string) => void;
  selectedLanguage?: {
    timeLimit?: number;
    memoryLimit?: number;
  } | null;
  selectedSampleIndex: number;
  onSampleChange: (value: number) => void;
  input: string;
  onInputChange: (value: string) => void;
  output: string;
  answer: string;
  onRun: () => void;
  onSubmit: () => void;
  onCheckSamples: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  isCheckingSamples: boolean;
  checkSamplesResult: Array<{
    verdict?: VerdictKey;
    verdictTitle?: string;
    input?: string;
    output?: string;
    answer?: string;
  }>;
  editorTab: 'console' | 'samples';
  onEditorTabChange: (value: 'console' | 'samples') => void;
  editorTheme: 'vs' | 'vs-dark';
};

const formatDuelDetailPageDate = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const DuelDetailPageWorkspace = ({
  duel,
  isLoading,
  isValidating,
  view,
  activeTab,
  navigationProblems,
  activeNavigationProblem,
  activeProblem,
  standingsRows,
  maxScore,
  isAuthenticated,
  attempts,
  attemptsTotal,
  attemptsPagination,
  onAttemptsPaginationChange,
  isAttemptsLoading,
  workspaceAttemptLink,
  onRefreshAttempts,
  onChangeView,
  onChangeTab,
  onSelectProblem,
  initialCode,
  editorKey,
  onCodeChange,
  selectedLang,
  onLangChange,
  selectedLanguage,
  selectedSampleIndex,
  onSampleChange,
  input,
  onInputChange,
  output,
  answer,
  onRun,
  onSubmit,
  onCheckSamples,
  isRunning,
  isSubmitting,
  isCheckingSamples,
  checkSamplesResult,
  editorTab,
  onEditorTabChange,
  editorTheme,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        position: 'relative',
      }}
    >
      {isLoading || isValidating ? (
        <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />
      ) : null}

      <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 0 }}>
        <Panel defaultSize={50} minSize={35}>
          {view === 'standings' ? (
            <Card
              background={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack spacing={0.5}>
                    <Typography variant="h5" fontWeight={700}>
                      {t('duels.standings')}
                    </Typography>
                    <Typography color="text.secondary">{t('duels.standingsSubtitle')}</Typography>
                  </Stack>

                  {standingsRows.map((row) => (
                    <Card
                      key={row.key}
                      variant="outlined"
                      sx={(theme) => ({
                        borderColor:
                          row.total === maxScore
                            ? alpha(theme.palette[row.accent].main, 0.45)
                            : alpha(
                                theme.palette.divider,
                                theme.palette.mode === 'dark' ? 0.75 : 1,
                              ),
                        backgroundColor:
                          row.total === maxScore
                            ? alpha(
                                theme.palette[row.accent].main,
                                theme.palette.mode === 'dark' ? 0.14 : 0.06,
                              )
                            : 'transparent',
                      })}
                    >
                      <CardContent>
                        <Stack spacing={1.5}>
                          <Stack
                            direction="row"
                            spacing={1.25}
                            alignItems="center"
                            flexWrap="wrap"
                            useFlexGap
                          >
                            <Typography fontWeight={800}>#{row.rank}</Typography>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {row.player.username}
                            </Typography>
                            {row.player.isBot ? (
                              <Chip size="small" color="secondary" variant="outlined" label="BOT" />
                            ) : null}
                            <Typography variant="body2" color="text.secondary">
                              {row.player.ratingTitle || '--'}
                            </Typography>
                            <Chip
                              label={`${row.total} pts`}
                              color={row.accent}
                              variant="outlined"
                              size="small"
                            />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>

              <DuelDetailPageResultsFooter
                duel={duel}
                problems={navigationProblems}
                activeSymbol={activeNavigationProblem?.symbol}
                view={view}
                onChangeView={onChangeView}
                onSelectProblem={onSelectProblem}
              />
            </Card>
          ) : activeProblem?.problem ? (
            <Card
              background={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 0 }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, value) => onChangeTab(value)}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{ px: 2, pt: 1 }}
                >
                  <Tab
                    sx={{ fontWeight: 600 }}
                    value="description"
                    label={t('contests.problem.description')}
                    icon={<IconifyIcon icon="mdi:book-open-page-variant" width={18} height={18} />}
                    iconPosition="start"
                  />
                  <Tab
                    sx={{ fontWeight: 600 }}
                    value="attempts"
                    label={t('duels.myAttempts')}
                    icon={<IconifyIcon icon="mdi:history" width={18} height={18} />}
                    iconPosition="start"
                  />
                </Tabs>
                <Divider />

                <Box sx={{ p: 3 }}>
                  {activeTab === 'description' ? (
                    <Stack spacing={2}>
                      <Stack spacing={1}>
                        <Typography variant="h5" fontWeight={700}>
                          {activeProblem.symbol}. {activeProblem.problem.title}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip label={`${activeProblem.ball ?? 0} pts`} size="small" />
                          <Chip
                            label={`${selectedLanguage?.timeLimit ?? activeProblem.problem.timeLimit ?? 0} ms`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={`${selectedLanguage?.memoryLimit ?? activeProblem.problem.memoryLimit ?? 0} MB`}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                      </Stack>

                      <ProblemBody problem={activeProblem.problem} />
                    </Stack>
                  ) : isAuthenticated ? (
                    <ProblemsAttemptsTable
                      attempts={attempts}
                      total={attemptsTotal}
                      paginationModel={attemptsPagination}
                      onPaginationChange={onAttemptsPaginationChange}
                      isLoading={isAttemptsLoading}
                      onRerun={onRefreshAttempts}
                      showProblemColumn={false}
                      getProblemLink={() => workspaceAttemptLink}
                    />
                  ) : (
                    <Typography color="text.secondary">{t('duels.signInForAttempts')}</Typography>
                  )}
                </Box>
              </CardContent>

              <DuelDetailPageResultsFooter
                duel={duel}
                problems={navigationProblems}
                activeSymbol={activeNavigationProblem?.symbol}
                view={view}
                onChangeView={onChangeView}
                onSelectProblem={onSelectProblem}
              />
            </Card>
          ) : navigationProblems.length && duel.status !== -1 && (isLoading || isValidating) ? (
            <ProblemDescriptionSkeleton />
          ) : (
            <Card
              background={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: 4,
                }}
              >
                <Stack spacing={1.5} alignItems="center" maxWidth={420}>
                  <IconifyIcon icon="mdi:shield-lock-outline" width={36} height={36} />
                  <Typography variant="h6" fontWeight={700}>
                    {activeNavigationProblem
                      ? `${activeNavigationProblem.symbol} | ${activeNavigationProblem.ball ?? 0} pts`
                      : t('duels.problems')}
                  </Typography>
                  <Typography color="text.secondary">
                    {duel.status === -1
                      ? t('duels.workspaceLockedDescription', {
                          startTime: formatDuelDetailPageDate(duel.startTime),
                        })
                      : t('duels.noProblems')}
                  </Typography>
                </Stack>
              </CardContent>

              <DuelDetailPageResultsFooter
                duel={duel}
                problems={navigationProblems}
                activeSymbol={activeNavigationProblem?.symbol}
                view={view}
                onChangeView={onChangeView}
                onSelectProblem={onSelectProblem}
              />
            </Card>
          )}
        </Panel>

        <PanelHandle />

        <Panel defaultSize={50} minSize={35}>
          {activeProblem?.problem ? (
            <ProblemEditorPanel
              problem={activeProblem.problem}
              initialCode={initialCode}
              editorKey={editorKey}
              onCodeChange={onCodeChange}
              selectedLang={selectedLang}
              onLangChange={onLangChange}
              sampleTests={activeProblem.problem.sampleTests ?? []}
              selectedSampleIndex={selectedSampleIndex}
              onSampleChange={onSampleChange}
              input={input}
              onInputChange={onInputChange}
              output={output}
              answer={answer}
              onRun={onRun}
              onSubmit={onSubmit}
              onCheckSamples={onCheckSamples}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              isCheckingSamples={isCheckingSamples}
              checkSamplesResult={checkSamplesResult}
              editorTab={editorTab}
              onEditorTabChange={onEditorTabChange}
              canUseCheckSamples={false}
              editorTheme={editorTheme}
            />
          ) : navigationProblems.length && duel.status !== -1 && (isLoading || isValidating) ? (
            <ProblemEditorSkeleton />
          ) : (
            <Card
              background={0}
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4,
              }}
            >
              <Stack spacing={1.5} alignItems="center" maxWidth={360}>
                <IconifyIcon icon="mdi:code-tags" width={40} height={40} />
                <Typography variant="h6" fontWeight={700}>
                  {activeNavigationProblem?.symbol
                    ? `${activeNavigationProblem.symbol} editor`
                    : t('duels.problems')}
                </Typography>
                <Typography color="text.secondary">
                  {duel.status === -1 ? t('duels.editorUnlockedOnStart') : t('duels.noProblems')}
                </Typography>
              </Stack>
            </Card>
          )}
        </Panel>
      </PanelGroup>
    </Card>
  );
};

export default DuelDetailPageWorkspace;
