import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { useAttemptVerdicts, useProblemSolution } from 'modules/problems/application/queries.ts';
import { DifficultyColor } from 'modules/problems/config/difficulty';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import OnlyMeSwitch from 'shared/components/common/OnlyMeSwitch';
import { ProblemAvailableLanguage, ProblemDetail } from '../../../domain/entities/problem.entity';
import ProblemsAttemptsTable from '../ProblemsAttemptsTable';
import { HackAttemptsCard } from './HackAttemptsCard';
import { ProblemBody } from './ProblemBody';
import { ProblemFooter } from './ProblemFooter';
import { ProblemStatisticsTab } from './ProblemStatisticsTab';

type TabValue = 'description' | 'attempts' | 'hacks' | 'stats';

interface HackPagination {
  page: number;
  pageSize: number;
}

interface ProblemDescriptionProps {
  problem: ProblemDetail;
  selectedDifficultyColor: DifficultyColor;
  activeTab: TabValue;
  onTabChange: (value: TabValue) => void;
  myAttemptsOnly: boolean;
  onToggleMyAttempts: () => void;
  attemptsLangFilter: string;
  onAttemptsLangFilterChange: (value: string) => void;
  attemptsVerdictFilter: string;
  onAttemptsVerdictFilterChange: (value: string) => void;
  attempts: any[];
  attemptsTotal: number;
  attemptsPagination: GridPaginationModel;
  onAttemptsPaginationChange: (model: GridPaginationModel) => void;
  isAttemptsLoading: boolean;
  onAttemptsRefresh: () => void;
  hackAttempts: any[];
  hackTotal: number;
  hackPagination: HackPagination;
  onHackPaginationChange: (pagination: HackPagination) => void;
  onHackRefresh: () => void;
  onFavoriteToggle: () => void;
  onLike: () => void;
  onDislike: () => void;
  selectedLanguage: ProblemAvailableLanguage | null;
}

export const ProblemDescription = ({
  problem,
  selectedDifficultyColor,
  activeTab,
  onTabChange,
  myAttemptsOnly,
  onToggleMyAttempts,
  attemptsLangFilter,
  onAttemptsLangFilterChange,
  attemptsVerdictFilter,
  onAttemptsVerdictFilterChange,
  attempts,
  attemptsTotal,
  attemptsPagination,
  onAttemptsPaginationChange,
  isAttemptsLoading,
  onAttemptsRefresh,
  hackAttempts,
  hackTotal,
  hackPagination,
  onHackPaginationChange,
  onHackRefresh,
  onFavoriteToggle,
  onLike,
  onDislike,
  selectedLanguage,
}: ProblemDescriptionProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [solutionExpanded, setSolutionExpanded] = useState(false);
  const { data: solution, isLoading: isSolutionLoading } = useProblemSolution(
    problem.id,
    solutionExpanded,
  );
  const { data: verdictOptions = [] } = useAttemptVerdicts();

  return (
    <Card
      background={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardHeader
        sx={{ py: 0 }}
        title={
          <Tabs
            value={activeTab}
            onChange={(_, value) => onTabChange(value)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              sx={{ fontWeight: 500 }}
              value="description"
              label={t('problems.detail.problemTab')}
              icon={<IconifyIcon icon="mdi:book-open-page-variant" />}
              iconPosition="start"
            />
            <Tab
              sx={{ fontWeight: 500 }}
              value="attempts"
              label={t('problems.detail.attemptsTab')}
              icon={<IconifyIcon icon="mdi:history" />}
              iconPosition="start"
            />
            <Tab
              sx={{ fontWeight: 500 }}
              value="stats"
              label={t('problems.detail.stats')}
              icon={<IconifyIcon icon="mdi:chart-bar" />}
              iconPosition="start"
            />
            <Tab
              sx={{ fontWeight: 500 }}
              value="hacks"
              label={t('problems.detail.hacksTab')}
              icon={<IconifyIcon icon="mdi:sword-cross" />}
              iconPosition="start"
              disabled={!problem?.hasCheckInput}
            />
          </Tabs>
        }
      />

      <Divider />

      <CardContent sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {activeTab === 'description' ? (
          <Stack direction="column" spacing={2}>
            <Stack direction="column" spacing={1} flexWrap="wrap">
              <Typography variant="h5" fontWeight={600}>
                {problem.id}. {problem.title}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={problem.difficultyTitle}
                  color={selectedDifficultyColor as any}
                  size="medium"
                />
                <Chip
                  label={`${t('problems.detail.timeLimit')}: ${
                    selectedLanguage?.timeLimit ??
                    problem.timeLimit ??
                    problem.availableLanguages?.[0]?.timeLimit ??
                    0
                  } ms`}
                  color="default"
                  variant="filled"
                  size="medium"
                />
                <Chip
                  label={`${t('problems.detail.memoryLimit')}: ${
                    selectedLanguage?.memoryLimit ??
                    problem.memoryLimit ??
                    problem.availableLanguages?.[0]?.memoryLimit ??
                    0
                  } MB`}
                  color="default"
                  variant="filled"
                  size="medium"
                />
              </Stack>
            </Stack>

            <ProblemBody problem={problem} />

            <Box>
              {problem.problemRating !== undefined && (
                <Chip
                  label={problem.problemRating}
                  color="default"
                  variant="outlined"
                  size="medium"
                  icon={<IconifyIcon icon="mdi:speedometer" />}
                />
              )}
            </Box>

            {problem.tags?.length || problem.topics?.length ? (
              <Accordion>
                <AccordionSummary
                  sx={{ p: 1 }}
                  expandIcon={<IconifyIcon icon="eva:arrow-ios-downward-fill" />}
                >
                  <Typography fontWeight={600}>{t('problems.detail.tagsTopics')}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2, py: 1 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(problem.tags ?? []).map((tag) => (
                      <Chip key={tag.id} label={tag.name} color="default" size="medium" />
                    ))}
                    {(problem.topics ?? []).map((topic) => (
                      <Chip key={topic.id} label={topic.name} color="info" size="medium" />
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ) : null}

            {problem.hasSolution ? (
              <Accordion
                expanded={solutionExpanded}
                onChange={(_, expanded) => setSolutionExpanded(expanded)}
              >
                <AccordionSummary expandIcon={<IconifyIcon icon="eva:arrow-ios-downward-fill" />}>
                  <Typography fontWeight={700}>{t('problems.detail.solution')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {isSolutionLoading ? (
                    <LinearProgress />
                  ) : solution ? (
                    <Stack direction="row" spacing={2}>
                      <Typography dangerouslySetInnerHTML={{ __html: solution.solution }} />
                      {solution.codes.map((code) => (
                        <Card key={code.lang} variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              {code.lang}
                            </Typography>
                            <Box
                              sx={{
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                p: 1.5,
                                borderRadius: 1,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              {code.code}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">
                      {t('problems.detail.noSolution')}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ) : null}
          </Stack>
        ) : null}

        {activeTab === 'attempts' ? (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', md: 'center' }}
                flexWrap="wrap"
                useFlexGap
              >
                {currentUser ? (
                  <OnlyMeSwitch
                    label={t('problems.detail.onlyMyAttempts')}
                    checked={myAttemptsOnly}
                    onChange={() => onToggleMyAttempts()}
                    switchSize="medium"
                  />
                ) : null}

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>{t('problems.attempts.language')}</InputLabel>
                  <Select
                    label={t('problems.attempts.language')}
                    value={attemptsLangFilter}
                    onChange={(event) => onAttemptsLangFilterChange(event.target.value)}
                  >
                    <MenuItem value="">{t('problems.attempts.anyLanguage')}</MenuItem>
                    {(problem.availableLanguages ?? []).map((lang) => (
                      <MenuItem key={lang.lang} value={lang.lang}>
                        {lang.langFull || lang.lang}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>{t('problems.attempts.verdict')}</InputLabel>
                  <Select
                    label={t('problems.attempts.verdict')}
                    value={attemptsVerdictFilter}
                    onChange={(event) => onAttemptsVerdictFilterChange(event.target.value)}
                  >
                    <MenuItem value="">{t('problems.attempts.anyVerdict')}</MenuItem>
                    {verdictOptions.map((option) => (
                      <MenuItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Tooltip title={t('problems.detail.refresh')}>
                <Button
                  variant="soft"
                  color="neutral"
                  onClick={onAttemptsRefresh}
                  size="large"
                >
                  <IconifyIcon icon="mdi:reload" />
                </Button>
              </Tooltip>
            </Stack>
            <ProblemsAttemptsTable
              attempts={attempts}
              total={attemptsTotal}
              paginationModel={attemptsPagination}
              onPaginationChange={onAttemptsPaginationChange}
              isLoading={isAttemptsLoading}
              onRerun={onAttemptsRefresh}
              showProblemColumn={false}
            />
          </>
        ) : null}

        {activeTab === 'stats' ? (
          <ProblemStatisticsTab problemId={problem.id} problem={problem} />
        ) : null}

        {activeTab === 'hacks' ? (
          <HackAttemptsCard
            attempts={hackAttempts}
            total={hackTotal}
            pagination={hackPagination}
            onPaginationChange={onHackPaginationChange}
            onRefresh={onHackRefresh}
          />
        ) : null}
      </CardContent>

      {activeTab === 'description' ? (
        <Box
          component="footer"
          sx={{
            flexShrink: 0,
            px: 3,
            py: 1.75,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <ProblemFooter
            problem={problem}
            onFavoriteToggle={onFavoriteToggle}
            onLike={onLike}
            onDislike={onDislike}
          />
        </Box>
      ) : null}
    </Card>
  );
};
