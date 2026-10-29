import { ChangeEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { Link as RouterLink } from 'react-router-dom';
import Editor, { useMonaco } from '@monaco-editor/react';
import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import {
  AttemptLangs,
  ProblemDetail,
  ProblemSampleTest,
} from 'modules/problems/domain/entities/problem.entity';
import type { SampleTestResult } from 'modules/problems/domain/entities/workspace.types';
import { detectPastedLanguage } from 'modules/problems/lib/detectPastedLanguage';
import KepIcon from 'shared/components/base/KepIcon';
import { WorkspacePane, WorkspaceToolbar } from 'shared/components/sections/common/Workspace';
import { useMonacoTheme } from 'shared/hooks/useMonacoTheme';
import { useLoginHref } from 'shared/lib/authRedirect';
import { toast } from 'sonner';
import { VerticalHandle } from './PanelHandles';
import ProblemConsole from './ProblemConsole';

const getEditorLanguage = (lang: string) =>
  ({
    [AttemptLangs.PYTHON]: 'python',
    [AttemptLangs.KOTLIN]: 'kotlin',
    [AttemptLangs.CSHARP]: 'csharp',
    [AttemptLangs.JS]: 'javascript',
    [AttemptLangs.TS]: 'typescript',
    [AttemptLangs.RUST]: 'rust',
    [AttemptLangs.KEP]: 'keplang',
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
  checkSamplesResult: SampleTestResult[];
  editorTab: 'console' | 'samples';
  onEditorTabChange: (value: 'console' | 'samples') => void;
  canUseCheckSamples: boolean;
  editorTheme: string;
  showSampleResultsTab?: boolean;
  isDisabled?: boolean;
  upsolveHref?: string;
  mobilePlain?: boolean;
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
    showSampleResultsTab = true,
    isDisabled = false,
    upsolveHref,
    mobilePlain = false,
  } = props;
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const codeTheme = useMonacoTheme(editorTheme);
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
      <WorkspacePane sx={{ alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Stack spacing={2} alignItems="flex-start" sx={{ maxWidth: 360 }}>
          <KepIcon name="problem" sx={{ fontSize: 36, color: 'primary.main' }} />
          <Typography variant="h5">{t('problems.detail.signInToSolve')}</Typography>
          <Typography color="text.secondary">{t('problems.detail.signInSubtitle')}</Typography>
          <Button component={RouterLink} to={loginHref} variant="contained">
            {t('auth.login')}
          </Button>
        </Stack>
      </WorkspacePane>
    );
  }

  return (
    <WorkspacePane component="section" aria-label={t('problems.workspace.editor')}>
      {isDisabled && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            backdropFilter: 'blur(2px)',
            display: 'grid',
            placeItems: 'center',
            p: 3,
          }}
        >
          <Stack spacing={2} alignItems="center" maxWidth={360}>
            <Typography variant="h6">{t('contests.problem.contestFinished')}</Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to={upsolveHref ?? resources.Problems}
            >
              {t('contests.problem.upsolve')}
            </Button>
          </Stack>
        </Box>
      )}
      <WorkspaceToolbar component="header">
        <Stack direction="row" alignItems="center" gap={1} sx={{ mr: 'auto', minWidth: 0 }}>
          <KepIcon name="problem" sx={{ color: 'primary.main', fontSize: 18 }} />
          <Typography
            variant="label"
            component="h2"
            sx={{ display: { xs: 'none', sm: 'block' }, whiteSpace: 'nowrap' }}
          >
            {t('problems.workspace.editor')}
          </Typography>
        </Stack>
        <TextField
          select
          size="small"
          variant="outlined"
          value={selectedLang}
          onChange={(event) => onLangChange(event.target.value)}
          disabled={isDisabled}
          slotProps={{
            select: {
              inputProps: { 'aria-label': t('problems.detail.language') },
              MenuProps: { slotProps: { paper: { variant: 'framed' } } },
            },
          }}
          sx={{
            minWidth: 140,
            maxWidth: 230,
            '& .MuiInputBase-root': { height: 36 },
            '& .MuiSelect-select': { py: 0.5, fontSize: 13 },
          }}
        >
          {problem?.availableLanguages?.map((lang) => (
            <MenuItem key={lang.lang} value={lang.lang}>
              {lang.langFull || lang.lang}
            </MenuItem>
          ))}
        </TextField>
        <Tooltip title={t('problems.detail.uploadFile')}>
          <Button
            component="label"
            variant="text"
            size="small"
            aria-label={t('problems.detail.uploadFile')}
            disabled={isDisabled}
            sx={{ minWidth: 36, width: 36, height: 36, p: 0 }}
          >
            <KepIcon name="upload" width={18} height={18} />
            <input
              hidden
              type="file"
              accept={fileAcceptTypes}
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={isDisabled}
            />
          </Button>
        </Tooltip>
      </WorkspaceToolbar>
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <PanelGroup direction="vertical" style={{ height: '100%' }}>
          <Panel defaultSize={68} minSize={30}>
            <Box sx={{ height: '100%', overflow: 'hidden', bgcolor: 'background.paper' }}>
              <Editor
                language={getEditorLanguage(selectedLang)}
                defaultValue={initialCode}
                onMount={(editor, mountedMonaco) => {
                  editorRef.current = editor;
                  monacoRef.current = mountedMonaco;
                }}
                onChange={(value) => {
                  if (isDisabled || typeof value !== 'string') return;
                  onCodeChange(value);
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
                  roundedSelection: false,
                  wordWrap: isCompact ? 'on' : 'off',
                  scrollBeyondLastLine: false,
                  lineHeight: 23,
                  lineNumbersMinChars: isCompact ? 3 : 4,
                  padding: { top: 18, bottom: 18 },
                  automaticLayout: true,
                  renderLineHighlight: 'all',
                  ariaLabel: t('problems.workspace.editor'),
                  scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                  guides: { indentation: true, highlightActiveIndentation: true },
                  readOnly: isDisabled,
                }}
                theme={codeTheme.theme}
                beforeMount={codeTheme.beforeMount}
                loading={<LinearProgress />}
                height="100%"
              />
            </Box>
          </Panel>
          <VerticalHandle />
          <Panel defaultSize={32} minSize={20}>
            <ProblemConsole
              input={input}
              output={output}
              answer={answer}
              onInputChange={onInputChange}
              sampleCount={sampleTests.length}
              selectedSampleIndex={selectedSampleIndex}
              onSampleChange={onSampleChange}
              editorTab={editorTab}
              onEditorTabChange={onEditorTabChange}
              showSampleResultsTab={showSampleResultsTab}
              isDisabled={isDisabled}
              checkSamplesResult={checkSamplesResult}
            />
          </Panel>
        </PanelGroup>
      </Box>
      <Stack
        component="footer"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{
          flexShrink: 0,
          px: 2.5,
          py: 0.75,
          borderTop: 1,
          borderColor: 'divider',
          display: { xs: mobilePlain ? 'none' : 'flex', sm: 'flex' },
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {selectedLanguageInfo?.langFull || selectedLang}
        </Typography>
        <Stack direction="row" gap={2}>
          <Typography variant="caption" color="text.secondary">
            {selectedLanguageInfo?.timeLimit ?? problem?.timeLimit ?? '--'} ms
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedLanguageInfo?.memoryLimit ?? problem?.memoryLimit ?? '--'} MB
          </Typography>
        </Stack>
      </Stack>
    </WorkspacePane>
  );
};
