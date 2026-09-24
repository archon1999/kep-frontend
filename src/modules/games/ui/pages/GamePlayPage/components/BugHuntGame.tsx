import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import {
  BUG_HUNT_ROUNDS,
  bugHuntOutputMatches,
  bugHuntQuestions,
  bugHuntScore,
} from 'modules/games/domain/mini-games/bug-hunt';
import GameFrame from './GameFrame.tsx';
import MiniGameCompletion from './MiniGameCompletion.tsx';
import MiniGameIntro from './MiniGameIntro.tsx';
import type { MiniGameProps } from './types.ts';

const codeToken = /("[^"]*"|'[^']*'|\b(?:for|in|if|const|let|return|true|false)\b|\b\d+\b)/g;

const renderCode = (line: string, selected: boolean) =>
  selected
    ? line
    : line.split(codeToken).map((part, index) => {
        const color = /^['"]/.test(part)
          ? '#a6d9bd'
          : /^\d+$/.test(part)
            ? '#f5c677'
            : /^(for|in|if|const|let|return|true|false)$/.test(part)
              ? '#8ab4ff'
              : 'inherit';
        return (
          <Box component="span" key={`${index}-${part}`} sx={{ color }}>
            {part}
          </Box>
        );
      });

const BugHuntGame = ({ best, onScore, audio }: MiniGameProps) => {
  const { t } = useTranslation();
  const [start, setStart] = useState(() => Math.floor(Math.random() * 2));
  const questions = useMemo(() => bugHuntQuestions(start), [start]);
  const codeScrollRef = useRef<HTMLDivElement>(null);
  const roundRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const [codeOverflow, setCodeOverflow] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'playing' | 'done'>('intro');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedFix, setSelectedFix] = useState<number | null>(null);
  const [outputDraft, setOutputDraft] = useState('');
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const question = questions[index];
  const fixIsCorrect = !question.fix || selectedFix === question.fix.correct;
  const outputIsCorrect =
    !question.expectedOutput ||
    (selectedOutput !== null && bugHuntOutputMatches(selectedOutput, question.expectedOutput));
  const isResolved =
    selected !== null &&
    (selected !== question.buggyLine ||
      !question.fix ||
      (selectedFix !== null &&
        (!fixIsCorrect || !question.expectedOutput || selectedOutput !== null)));
  const isCorrect = selected === question.buggyLine && fixIsCorrect && outputIsCorrect;

  useEffect(() => {
    if (phase !== 'playing') return;
    const node = codeScrollRef.current;
    if (!node) return;
    node.scrollLeft = 0;
    const measure = () => setCodeOverflow(node.scrollWidth > node.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [phase, question.id]);

  useEffect(() => {
    if (phase !== 'playing' || !window.matchMedia('(max-width: 899.95px)').matches) return;
    const frame = requestAnimationFrame(() =>
      roundRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
        block: 'start',
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [phase, index]);

  useEffect(() => {
    if (phase !== 'playing' || isResolved || selected !== question.buggyLine) return;
    if (!window.matchMedia('(max-width: 899.95px)').matches) return;
    const frame = requestAnimationFrame(() =>
      answerRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
        block: 'center',
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [phase, selected, selectedFix, isResolved, question.buggyLine]);

  const startRun = () => {
    audio.startFromGesture();
    setStart((previous) => previous + 1);
    setIndex(0);
    setSelected(null);
    setSelectedFix(null);
    setSelectedOutput(null);
    setOutputDraft('');
    setCorrect(0);
    setStreak(0);
    setLongestStreak(0);
    setPhase('playing');
  };

  const recordAnswer = (correctAnswer: boolean) => {
    if (correctAnswer) {
      audio.playCue('correct');
      setCorrect((value) => value + 1);
      setStreak((value) => {
        setLongestStreak((longest) => Math.max(longest, value + 1));
        return value + 1;
      });
    } else {
      audio.playCue('wrong');
      setStreak(0);
    }
  };

  const selectLine = (line: number) => {
    if (phase !== 'playing' || selected !== null) return;
    setSelected(line);
    if (line === question.buggyLine && question.fix) {
      audio.playCue('select');
      return;
    }
    recordAnswer(line === question.buggyLine);
  };

  const selectFix = (option: number) => {
    if (
      phase !== 'playing' ||
      selected !== question.buggyLine ||
      !question.fix ||
      selectedFix !== null
    )
      return;
    setSelectedFix(option);
    if (option === question.fix.correct && question.expectedOutput) {
      audio.playCue('select');
      return;
    }
    recordAnswer(option === question.fix.correct);
  };

  const submitOutput = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      phase !== 'playing' ||
      selected !== question.buggyLine ||
      !question.fix ||
      selectedFix !== question.fix.correct ||
      !question.expectedOutput ||
      selectedOutput !== null ||
      !outputDraft.trim()
    )
      return;
    setSelectedOutput(outputDraft);
    recordAnswer(bugHuntOutputMatches(outputDraft, question.expectedOutput));
  };

  const next = () => {
    if (index === BUG_HUNT_ROUNDS - 1) {
      audio.stop();
      setPhase('done');
      onScore(bugHuntScore(correct));
    } else {
      setIndex((value) => value + 1);
      setSelected(null);
      setSelectedFix(null);
      setSelectedOutput(null);
      setOutputDraft('');
    }
  };

  return (
    <GameFrame
      showStatus={false}
      best={best}
      score={bugHuntScore(correct)}
      progress={phase === 'done' ? 100 : phase === 'intro' ? 0 : (index / BUG_HUNT_ROUNDS) * 100}
    >
      {phase === 'intro' ? (
        <MiniGameIntro
          id="bug-hunt"
          title={t('gamesMinis.bugHunt.readyTitle')}
          description={t('gamesMinis.bugHunt.instructions')}
          action={t('gamesMinis.common.start')}
          onStart={startRun}
        />
      ) : phase === 'done' ? (
        <MiniGameCompletion
          score={bugHuntScore(correct)}
          best={best}
          title={t('gamesMinis.bugHunt.doneTitle')}
          detail={t('gamesMinis.bugHunt.doneDetail', {
            correct,
            total: BUG_HUNT_ROUNDS,
            streak: longestStreak,
          })}
          onReplay={startRun}
        />
      ) : (
        <Stack ref={roundRef} sx={{ scrollMarginTop: 80 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1.5}
            sx={{
              px: { xs: 2.25, md: 3 },
              py: 1.25,
              bgcolor: '#102333',
              borderRadius: '8px 8px 0 0',
            }}
          >
            <Typography variant="caption" sx={{ color: '#94b7d0', fontWeight: 700 }}>
              {t('gamesMinis.common.round', { current: index + 1, total: BUG_HUNT_ROUNDS })}
            </Typography>
            <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 2 }}>
              {streak > 0 && (
                <Typography variant="caption" sx={{ color: '#ffc67a', fontWeight: 700 }}>
                  {t('gamesMinis.bugHunt.streak', { count: streak })}
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: '#f6fbff', fontWeight: 700 }}>
                {t('gamesMinis.common.score', { score: bugHuntScore(correct) })}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{
              minHeight: { md: 320 },
              bgcolor: '#14293b',
              borderRadius: '0 0 8px 8px',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: { md: 292 },
                flexShrink: 0,
                p: { xs: 2.25, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: 18, sm: 20, md: 21 },
                  fontWeight: 650,
                  lineHeight: 1.36,
                  letterSpacing: '-0.012em',
                  color: '#f6fbff',
                }}
              >
                {t(`gamesMinis.bugHunt.questions.${question.id}.task`)}
              </Typography>
              <Box
                sx={{
                  mt: 0.75,
                  color: '#abc2d4',
                  display: {
                    xs:
                      selected === question.buggyLine && question.fix && selectedFix === null
                        ? 'none'
                        : 'block',
                    md: 'block',
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.5 }}>
                  {t(
                    selected === question.buggyLine && question.fix && !isResolved
                      ? selectedFix === question.fix.correct && question.expectedOutput
                        ? 'gamesMinis.bugHunt.selectOutput'
                        : 'gamesMinis.bugHunt.selectFix'
                      : 'gamesMinis.bugHunt.selectLine',
                  )}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
              <Box
                sx={{
                  bgcolor: '#102333',
                  borderRadius: 0,
                  overflow: 'hidden',
                  boxShadow: 'none',
                  flex: 1,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    bgcolor: '#102331',
                    borderBottom: '1px solid #ffffff24',
                  }}
                >
                  <Typography variant="caption" fontWeight={700} sx={{ color: 'grey.400' }}>
                    {question.language}
                  </Typography>
                  {codeOverflow && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'grey.400', fontSize: 11, whiteSpace: 'nowrap' }}
                    >
                      <Box component="span" aria-hidden="true" sx={{ mr: 0.5 }}>
                        ↔
                      </Box>
                      {t('gamesMinis.bugHunt.scrollCode')}
                    </Typography>
                  )}
                </Stack>
                <Box
                  ref={codeScrollRef}
                  sx={{ py: { xs: 0.75, md: 2 }, overflowX: 'auto', minHeight: { md: 272 } }}
                >
                  {question.code.map((line, lineIndex) => {
                    const lineNumber = lineIndex + 1;
                    const correctLine = selected !== null && lineNumber === question.buggyLine;
                    const wrongLine = selected === lineNumber && !correctLine;
                    return (
                      <Box
                        component="button"
                        type="button"
                        key={lineNumber}
                        disabled={selected !== null}
                        onClick={() => selectLine(lineNumber)}
                        aria-label={`${t('gamesMinis.bugHunt.lineLabel', { line: lineNumber })}: ${line}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          minWidth: 'max-content',
                          minHeight: { xs: 44, sm: 36 },
                          border: 0,
                          textAlign: 'left',
                          p: 0,
                          m: 0,
                          cursor: selected === null ? 'pointer' : 'default',
                          bgcolor: correctLine
                            ? 'success.dark'
                            : wrongLine
                              ? 'error.dark'
                              : 'transparent',
                          color: correctLine
                            ? 'success.contrastText'
                            : wrongLine
                              ? 'error.contrastText'
                              : 'common.white',
                          '&:hover':
                            selected === null ? { bgcolor: 'rgba(74, 149, 232, 0.22)' } : {},
                          '&:focus-visible': { outline: '2px solid white', outlineOffset: -2 },
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            fontFamily: 'monospace',
                            px: 1.5,
                            py: 1,
                            color: correctLine || wrongLine ? 'inherit' : 'grey.400',
                            borderRight: '1px solid #ffffff28',
                            minWidth: 44,
                            textAlign: 'right',
                          }}
                        >
                          {lineNumber}
                        </Box>
                        <Box
                          component="code"
                          sx={{
                            fontFamily: 'monospace',
                            whiteSpace: 'pre',
                            px: 1.5,
                            py: 1,
                            fontSize: { xs: 13, sm: 14 },
                          }}
                        >
                          {renderCode(line, correctLine || wrongLine)}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Stack>
          {selected === question.buggyLine && question.fix && selectedFix === null && (
            <Stack
              ref={answerRef}
              gap={1}
              sx={{ ml: { md: '292px' }, px: { xs: 0, md: 2.5 }, py: 2 }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {t('gamesMinis.bugHunt.selectFix')}
              </Typography>
              {question.fix.options.map((option, optionIndex) => (
                <Button
                  key={option}
                  variant="outlined"
                  onClick={() => selectFix(optionIndex)}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    borderRadius: 1.5,
                    py: 1.25,
                  }}
                >
                  <Box
                    component="code"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: 13,
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {option}
                  </Box>
                </Button>
              ))}
            </Stack>
          )}
          {selected === question.buggyLine &&
            question.fix &&
            selectedFix === question.fix.correct &&
            question.expectedOutput &&
            selectedOutput === null && (
              <Box ref={answerRef} sx={{ ml: { md: '292px' }, px: { xs: 0, md: 2.5 }, py: 2 }}>
                <Stack
                  component="form"
                  direction={{ xs: 'column', sm: 'row' }}
                  gap={1.25}
                  onSubmit={submitOutput}
                >
                  <TextField
                    autoComplete="off"
                    label={t('gamesMinis.bugHunt.outputLabel')}
                    value={outputDraft}
                    onChange={(event) => setOutputDraft(event.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                    slotProps={{ htmlInput: { spellCheck: false } }}
                  />
                  <Button variant="contained" type="submit" disabled={!outputDraft.trim()}>
                    {t('gamesMinis.bugHunt.checkOutput')}
                  </Button>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', mt: 0.75, color: 'text.secondary' }}
                >
                  {t('gamesMinis.bugHunt.outputHint')}
                </Typography>
              </Box>
            )}
          {isResolved && (
            <Stack
              gap={1.5}
              sx={{
                ml: { md: '292px' },
                px: { xs: 2, md: 2.5 },
                py: 2,
                bgcolor: '#102333',
                color: '#f6fbff',
                borderRadius: 2,
              }}
            >
              <Box role="status">
                <Typography fontWeight={700} sx={{ color: isCorrect ? '#8be4c6' : '#ffd19b' }}>
                  {t(
                    isCorrect
                      ? 'gamesMinis.bugHunt.correct'
                      : selected === question.buggyLine
                        ? selectedFix === question.fix?.correct
                          ? 'gamesMinis.bugHunt.incorrectOutput'
                          : 'gamesMinis.bugHunt.incorrectFix'
                        : 'gamesMinis.bugHunt.incorrect',
                    {
                      line: question.buggyLine,
                    },
                  )}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: '#c1d4e1' }}>
                  {t(`gamesMinis.bugHunt.questions.${question.id}.explain`)}
                </Typography>
                {question.expectedOutput && !isCorrect && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, fontFamily: 'monospace', color: '#c1d4e1' }}
                  >
                    {t('gamesMinis.bugHunt.expectedOutput', { output: question.expectedOutput })}
                  </Typography>
                )}
              </Box>
              <Button
                variant="contained"
                onClick={next}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-end' } }}
              >
                {index === BUG_HUNT_ROUNDS - 1
                  ? t('gamesMinis.common.finish')
                  : t('gamesMinis.common.next')}
              </Button>
            </Stack>
          )}
        </Stack>
      )}
    </GameFrame>
  );
};

export default BugHuntGame;
