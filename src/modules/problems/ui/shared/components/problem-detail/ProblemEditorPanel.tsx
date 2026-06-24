import { ChangeEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { Link as RouterLink } from 'react-router-dom';
import Editor, { useMonaco } from '@monaco-editor/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import {
  AttemptLangs,
  ProblemDetail,
  ProblemSampleTest,
} from 'modules/problems/domain/entities/problem.entity';
import { detectPastedLanguage } from 'modules/problems/lib/detectPastedLanguage';
import KepIcon from 'shared/components/base/KepIcon';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import AttemptVerdict from 'shared/components/problems/AttemptVerdict';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import { useLoginHref } from 'shared/lib/authRedirect';
import { toast } from 'sonner';
import { VerticalHandle } from './PanelHandles';

const getEditorLanguage = (lang: string) =>
  ({
    [AttemptLangs.PYTHON]: 'python',
    [AttemptLangs.KOTLIN]: 'kotlin',
    [AttemptLangs.CSHARP]: 'csharp',
    [AttemptLangs.JS]: 'javascript',
    [AttemptLangs.TS]: 'typescript',
    [AttemptLangs.RUST]: 'rust',
  })[lang] ||
  lang ||
  'javascript';

interface ProblemEditorPanelProps {
  problem?: ProblemDetail;
  initialCode: string;
  editorKey: string;
  onCodeChange: (value: string) => void;
  selectedLang: string;
  onLangChange: (value: string) => void;
  sampleTests: ProblemSampleTest[];
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
  canUseCheckSamples: boolean;
  editorTheme: string;
  isDisabled?: boolean;
  upsolveHref?: string;
}

const fileAcceptTypes = Object.values(AttemptLangs)
  .map((lang) => `.${lang}`)
  .join(',');

export const ProblemEditorPanel = (props: ProblemEditorPanelProps) => {
  const {
    problem,
    initialCode,
    editorKey,
    onCodeChange,
    selectedLang,
    onLangChange,
    sampleTests,
    selectedSampleIndex,
    onSampleChange,
    input,
    onInputChange,
    output,
    answer,
    checkSamplesResult,
    editorTab,
    onEditorTabChange,
    editorTheme,
    isDisabled = false,
    upsolveHref,
  } = props;
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('sm'));
  const loginHref = useLoginHref();
  const selectedLanguageInfo = problem?.availableLanguages?.find(
    (lang) => lang.lang === selectedLang,
  );

  const monaco = useMonaco();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const pendingPastedTextRef = useRef<string | null>(null);

  const detectAndApplyPastedLanguage = (nextValue?: string, pastedText?: string | null) => {
    const editor = editorRef.current;
    if (!editor) return;

    const editorValue = nextValue ?? editor.getValue();
    const sourceForDetection = pastedText?.trim() ? pastedText : editorValue;
    const detectedLang = detectPastedLanguage(
      sourceForDetection,
      problem?.availableLanguages,
      selectedLang,
    );

    if (!detectedLang || detectedLang === selectedLang) return;

    onCodeChange(editorValue);
    onLangChange(detectedLang);
  };

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(editorTheme);
    }
  }, [monaco, editorTheme]);

  useEffect(() => {
    const editor = editorRef.current;
    const monacoInstance = monacoRef.current ?? monaco;

    if (!editor || !monacoInstance) return;

    const model = editor.getModel();
    if (!model) return;

    const nextLanguage = getEditorLanguage(selectedLang);
    if (model && typeof monacoInstance.editor?.setModelLanguage === 'function') {
      monacoInstance.editor.setModelLanguage(model, nextLanguage);
    }
  }, [selectedLang, monaco]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (editor.getValue() !== initialCode) {
      editor.setValue(initialCode);
    }
  }, [editorKey, initialCode]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || isDisabled) return;

    const domNode = editor.getDomNode?.();
    const handleDomPaste = (event: ClipboardEvent) => {
      pendingPastedTextRef.current = event.clipboardData?.getData('text/plain') ?? null;
      window.setTimeout(() => {
        detectAndApplyPastedLanguage(undefined, pendingPastedTextRef.current);
        pendingPastedTextRef.current = null;
      }, 0);
    };

    const subscription = editor.onDidPaste((pasteEvent: any) => {
      window.setTimeout(() => {
        detectAndApplyPastedLanguage(
          editor.getValue(),
          pasteEvent?.clipboardEvent?.clipboardData?.getData('text/plain') ??
            pendingPastedTextRef.current,
        );
        pendingPastedTextRef.current = null;
      }, 0);
    });

    domNode?.addEventListener('paste', handleDomPaste);

    return () => {
      subscription.dispose();
      domNode?.removeEventListener('paste', handleDomPaste);
    };
  }, [isDisabled, onCodeChange, onLangChange, problem?.availableLanguages, selectedLang]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const matchedLang =
      extension && Object.values(AttemptLangs).find((lang) => lang.toLowerCase() === extension);

    if (!matchedLang) {
      toast.error(t('problems.detail.unsupportedFileExtension'));
      event.target.value = '';
      return;
    }

    const isLangAvailable = problem?.availableLanguages?.some((lang) => lang.lang === matchedLang);
    if (!isLangAvailable) {
      toast.error(t('problems.detail.languageNotAvailable'));
      event.target.value = '';
      return;
    }

    const content = await file.text();
    editorRef.current?.setValue(content);
    onCodeChange(content);
    if (matchedLang !== selectedLang) {
      onLangChange(matchedLang);
    }

    event.target.value = '';
  };

  if (!currentUser) {
    return (
      <Card
        background={0}
        sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Card variant="outlined" sx={{ maxWidth: 520 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('problems.detail.signInToSolve')}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              {t('problems.detail.signInSubtitle')}
            </Typography>
            <Button component={RouterLink} to={loginHref} variant="contained">
              {t('auth.login')}
            </Button>
          </CardContent>
        </Card>
      </Card>
    );
  }

  return (
    <Card
      background={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {isDisabled ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 3,
          }}
        >
          <Stack spacing={1.5} alignItems="center" maxWidth={360}>
            <Typography variant="subtitle1" fontWeight={700}>
              {t('contests.problem.contestFinished')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to={upsolveHref ?? resources.Problems}
            >
              {t('contests.problem.upsolve')}
            </Button>
          </Stack>
        </Box>
      ) : null}
      <Box
        component="header"
        sx={{
          flexShrink: 0,
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1, sm: 1.5 },
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <TextField
            select
            size="small"
            variant="outlined"
            label={t('problems.detail.language')}
            value={selectedLang}
            onChange={(event) => onLangChange(event.target.value)}
            disabled={isDisabled}
            sx={{
              flex: { xs: '1 1 calc(50% - 6px)', sm: '0 0 auto' },
              minWidth: { xs: 0, sm: 180 },
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
            }}
          >
            {problem?.availableLanguages?.map((lang) => (
              <MenuItem key={lang.lang} value={lang.lang}>
                {lang.langFull || lang.lang}
              </MenuItem>
            ))}
          </TextField>

          {sampleTests.length ? (
            <TextField
              select
              size="small"
              variant="outlined"
              label={t('problems.detail.sample')}
              value={selectedSampleIndex}
              onChange={(event) => onSampleChange(Number(event.target.value))}
              disabled={isDisabled}
              sx={{
                flex: { xs: '1 1 calc(50% - 6px)', sm: '0 0 auto' },
                minWidth: { xs: 0, sm: 140 },
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
              }}
            >
              {sampleTests.map((_, index) => (
                <MenuItem key={index} value={index}>
                  #{index + 1}
                </MenuItem>
              ))}
            </TextField>
          ) : null}

          <Button
            component="label"
            variant="text"
            size="small"
            startIcon={<KepIcon name="upload" width={18} height={18} />}
            disabled={isDisabled}
            sx={{
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              minHeight: { xs: 32, sm: 'auto' },
              borderRadius: 2,
            }}
          >
            {t('problems.detail.uploadFile')}
            <input
              hidden
              type="file"
              accept={fileAcceptTypes}
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={isDisabled}
            />
          </Button>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', px: { xs: 1, sm: 2 } }}>
        <PanelGroup direction="vertical" style={{ height: '100%' }}>
          <Panel defaultSize={isCompact ? 68 : 45} minSize={isCompact ? 45 : 25}>
            <Box
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? `linear-gradient(140deg, ${alpha(theme.palette.primary.light, 0.26)}, ${alpha(
                        theme.palette.background.default,
                        0.24,
                      )})`
                    : `linear-gradient(140deg, ${alpha(theme.palette.primary.light, 0.07)}, ${alpha(
                        theme.palette.background.paper,
                        0.06,
                      )})`,
                boxShadow: (theme) => theme.shadows[2],
                '& .monaco-editor, & .monaco-editor-background, & .margin': {
                  backgroundColor: 'transparent !important',
                },
              }}
            >
              <Editor
                language={getEditorLanguage(selectedLang)}
                defaultValue={initialCode}
                onMount={(editor, mountedMonaco) => {
                  editorRef.current = editor;
                  monacoRef.current = mountedMonaco;
                }}
                onChange={(value) => {
                  if (isDisabled || typeof value !== 'string') return;
                  onCodeChange(value ?? '');
                  if (pendingPastedTextRef.current !== null) {
                    window.setTimeout(() => {
                      detectAndApplyPastedLanguage(value, pendingPastedTextRef.current);
                      pendingPastedTextRef.current = null;
                    }, 0);
                  }
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: isCompact ? 13 : 14,
                  fontLigatures: true,
                  smoothScrolling: true,
                  roundedSelection: true,
                  wordWrap: isCompact ? 'on' : 'off',
                  scrollBeyondLastLine: false,
                  lineHeight: isCompact ? 20 : 22,
                  lineNumbersMinChars: isCompact ? 3 : 5,
                  padding: { top: isCompact ? 8 : 0, bottom: isCompact ? 8 : 0 },
                  automaticLayout: true,
                  renderLineHighlight: 'all',
                  scrollbar: {
                    verticalScrollbarSize: isCompact ? 10 : 12,
                    horizontalScrollbarSize: isCompact ? 10 : 12,
                  },
                  guides: {
                    indentation: true,
                    highlightActiveIndentation: true,
                  },
                  readOnly: isDisabled,
                }}
                theme={editorTheme}
                loading={<LinearProgress />}
                height="100%"
              />
            </Box>
          </Panel>

          <VerticalHandle />

          <Panel defaultSize={isCompact ? 32 : 55} minSize={isCompact ? 20 : 25}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.1),
                boxShadow: (theme) => theme.shadows[1],
              }}
            >
              <ResponsiveTabs
                value={editorTab}
                onChange={(value) => {
                  if (isDisabled) return;
                  onEditorTabChange(value);
                }}
                items={[
                  {
                    value: 'console',
                    label: t('problems.detail.console'),
                    disabled: isDisabled,
                  },
                  {
                    value: 'samples',
                    label: t('problems.detail.samplesResult'),
                    disabled: isDisabled,
                  },
                ]}
                ariaLabel="editor output tabs"
                tabsProps={{
                  variant: 'fullWidth',
                  textColor: 'primary',
                  indicatorColor: 'primary',
                  sx: {
                    px: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      minHeight: 0,
                      fontWeight: 600,
                    },
                  },
                }}
              />

              <Box
                sx={{
                  p: { xs: 1, sm: 1.25 },
                  flex: 1,
                  overflow: 'auto',
                }}
              >
                {editorTab === 'console' ? (
                  <Stack direction="column" spacing={1.5}>
                    <TextField
                      multiline
                      minRows={3}
                      label={t('problems.detail.customInput')}
                      value={input}
                      onChange={(event) => onInputChange(event.target.value)}
                      disabled={isDisabled}
                    />
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                      <TextField
                        fullWidth
                        label={t('problems.detail.yourOutput')}
                        multiline
                        minRows={4}
                        value={output}
                        InputProps={{ readOnly: true }}
                      />
                      <TextField
                        fullWidth
                        label={t('problems.detail.answer')}
                        multiline
                        minRows={4}
                        value={answer}
                        InputProps={{ readOnly: true }}
                      />
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction="column" spacing={1}>
                    {checkSamplesResult.length === 0 ? (
                      <Typography color="text.secondary">
                        {t('problems.detail.noSamplesResult')}
                      </Typography>
                    ) : (
                      checkSamplesResult.map((result, index) => (
                        <Card key={index} variant="outlined">
                          <CardContent>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography variant="subtitle2">#{index + 1}</Typography>
                              {result.verdict != null ? (
                                <AttemptVerdict
                                  verdict={result.verdict}
                                  title={result.verdictTitle ?? t('problems.detail.samplesResult')}
                                />
                              ) : null}
                            </Stack>
                            {result.input ? (
                              <Box mt={1}>
                                <Typography variant="caption" color="text.secondary">
                                  {t('problems.detail.customInput')}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: 'monospace',
                                    whiteSpace: 'pre-wrap',
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                >
                                  {result.input}
                                </Typography>
                              </Box>
                            ) : null}
                            {result.output ? (
                              <Box mt={1}>
                                <Typography variant="caption" color="text.secondary">
                                  {t('problems.detail.yourOutput')}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: 'monospace',
                                    whiteSpace: 'pre-wrap',
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                >
                                  {result.output}
                                </Typography>
                              </Box>
                            ) : null}
                            {result.answer ? (
                              <Box mt={1}>
                                <Typography variant="caption" color="text.secondary">
                                  {t('problems.detail.answer')}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: 'monospace',
                                    whiteSpace: 'pre-wrap',
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                >
                                  {result.answer}
                                </Typography>
                              </Box>
                            ) : null}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </Stack>
                )}
              </Box>
            </Box>
          </Panel>
        </PanelGroup>
      </Box>

      <Box
        component="footer"
        sx={{
          flexShrink: 0,
          px: { xs: 1.5, sm: 3 },
          py: { xs: 1, sm: 1.25 },
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          justifyContent="space-between"
          sx={{ minWidth: 0 }}
        >
          <Typography variant="caption" color="text.secondary">
            {t('problems.detail.language')}:{' '}
            {selectedLanguageInfo?.langFull || selectedLanguageInfo?.lang || '--'}
          </Typography>
          {selectedLanguageInfo ? (
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Typography variant="caption" color="text.secondary">
                {t('problems.detail.timeLimit')}:{' '}
                {selectedLanguageInfo.timeLimit ?? problem?.timeLimit ?? '--'} ms
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('problems.detail.memoryLimit')}:{' '}
                {selectedLanguageInfo.memoryLimit ?? problem?.memoryLimit ?? '--'} MB
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </Box>
    </Card>
  );
};
