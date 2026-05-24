import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Editor, { DiffEditor } from '@monaco-editor/react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useBreakpoints } from 'app/providers/BreakpointsProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources';
import { problemsQueries } from 'modules/problems/application/queries';
import {
  AttemptDetail,
  AttemptLangs,
  AttemptListItem,
  Verdicts,
} from 'modules/problems/domain/entities/problem.entity';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import AttemptVerdict from 'shared/components/problems/AttemptVerdict';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { toast } from 'sonner';

const mapEditorLanguage = (lang?: string) => {
  switch (lang) {
    case AttemptLangs.PYTHON:
      return 'python';
    case AttemptLangs.CPP:
      return 'cpp';
    case AttemptLangs.C:
      return 'c';
    case AttemptLangs.JS:
      return 'javascript';
    case AttemptLangs.TS:
      return 'typescript';
    case AttemptLangs.JAVA:
      return 'java';
    case AttemptLangs.KOTLIN:
      return 'kotlin';
    case AttemptLangs.RUST:
      return 'rust';
    default:
      return lang || 'plaintext';
  }
};

interface AttemptDetailDialogProps {
  open: boolean;
  attempt: AttemptListItem | null;
  onClose: () => void;
  onAttemptUpdated?: (attemptId: number, changes: Partial<AttemptListItem>) => void;
}

interface AttemptCompareDialogProps {
  open: boolean;
  baseAttempt: AttemptDetail | AttemptListItem | null;
  currentDetail: AttemptDetail | null;
  onClose: () => void;
}

const AttemptCompareDialog = ({
  open,
  baseAttempt,
  currentDetail,
  onClose,
}: AttemptCompareDialogProps) => {
  const { t } = useTranslation();
  const themeMode = useThemeMode();
  const { up } = useBreakpoints();
  const upMd = up('md');
  const [previousAttemptId, setPreviousAttemptId] = useState('');
  const [currentAttemptId, setCurrentAttemptId] = useState('');
  const [previousSourceCode, setPreviousSourceCode] = useState('');
  const [currentSourceCode, setCurrentSourceCode] = useState('');
  const [editorLanguage, setEditorLanguage] = useState(mapEditorLanguage(baseAttempt?.lang));
  const [isLoading, setIsLoading] = useState(false);

  const parseAttemptId = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return null;

      const id = Number(trimmed);
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error(t('problems.attempts.modal.invalidAttemptId'));
      }

      return id;
    },
    [t],
  );

  const fetchAttemptDetail = useCallback(
    async (id: number) => {
      if (currentDetail?.id === id && currentDetail.sourceCode !== undefined) {
        return currentDetail;
      }

      return problemsQueries.problemsRepository.getAttempt(id);
    },
    [currentDetail],
  );

  const loadComparison = useCallback(
    async (previousValue: string, currentValue: string) => {
      let previousId: number | null = null;
      let currentId: number | null = null;

      try {
        previousId = parseAttemptId(previousValue);
        currentId = parseAttemptId(currentValue);
      } catch (error: any) {
        toast.error(error?.message ?? t('problems.attempts.modal.loadError'));
        return;
      }

      setIsLoading(true);
      try {
        const [previousAttempt, currentAttempt] = await Promise.all([
          previousId ? fetchAttemptDetail(previousId) : Promise.resolve(null),
          currentId ? fetchAttemptDetail(currentId) : Promise.resolve(null),
        ]);

        setPreviousSourceCode(previousAttempt?.sourceCode ?? '');
        setCurrentSourceCode(currentAttempt?.sourceCode ?? '');
        setEditorLanguage(
          mapEditorLanguage(currentAttempt?.lang ?? previousAttempt?.lang ?? baseAttempt?.lang),
        );
      } catch (error: any) {
        const fallbackMessage = t('problems.attempts.modal.loadError');
        const message = error?.response?.data?.message ?? error?.message ?? fallbackMessage;
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [baseAttempt?.lang, fetchAttemptDetail, parseAttemptId, t],
  );

  useEffect(() => {
    if (!open) {
      setPreviousAttemptId('');
      setCurrentAttemptId('');
      setPreviousSourceCode('');
      setCurrentSourceCode('');
      return;
    }

    const nextPreviousId = currentDetail?.previousAttemptId
      ? String(currentDetail.previousAttemptId)
      : '';
    const nextCurrentId = baseAttempt?.id ? String(baseAttempt.id) : '';

    setPreviousAttemptId(nextPreviousId);
    setCurrentAttemptId(nextCurrentId);
    loadComparison(nextPreviousId, nextCurrentId);
  }, [baseAttempt?.id, currentDetail?.previousAttemptId, loadComparison, open]);

  const handleCompare = () => {
    loadComparison(previousAttemptId, currentAttemptId);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h6" fontWeight={700}>
            {t('problems.attempts.modal.compareTitle', { id: baseAttempt?.id ?? '--' })}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <IconifyIcon icon="mdi:close" width={20} height={20} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'stretch', md: 'center' }}
          >
            <TextField
              label={t('problems.attempts.modal.previousAttempt')}
              value={previousAttemptId}
              onChange={(event) => setPreviousAttemptId(event.target.value)}
              size="small"
              type="number"
              sx={{ flex: 1 }}
            />
            <TextField
              label={t('problems.attempts.modal.currentAttempt')}
              value={currentAttemptId}
              onChange={(event) => setCurrentAttemptId(event.target.value)}
              size="small"
              type="number"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleCompare}
              disabled={isLoading}
              startIcon={<IconifyIcon icon="material-symbols:compare-rounded" />}
              sx={{ minWidth: 140 }}
            >
              {t('problems.attempts.modal.compare')}
            </Button>
          </Stack>
        </Box>

        {isLoading ? <LinearProgress /> : null}

        <Box sx={{ height: { xs: '60vh', md: '68vh' }, minHeight: 420 }}>
          <DiffEditor
            original={previousSourceCode}
            modified={currentSourceCode}
            language={editorLanguage}
            theme={themeMode.mode === 'dark' ? 'vs-dark' : 'vs'}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              wordWrap: 'off',
              automaticLayout: true,
              renderSideBySide: upMd,
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const AttemptDetailDialog = ({
  open,
  attempt,
  onClose,
  onAttemptUpdated,
}: AttemptDetailDialogProps) => {
  const { t } = useTranslation();
  const themeMode = useThemeMode();
  const { currentUser } = useAuth();
  const [detail, setDetail] = useState<AttemptDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const baseAttempt = detail ?? attempt;
  const canViewAttempt = Boolean(baseAttempt?.canView);
  const canViewTest = Boolean(baseAttempt?.canTestView);
  const isOwner =
    Boolean(currentUser?.username) && baseAttempt?.user?.username === currentUser?.username;
  const isContestAttempt = Boolean(baseAttempt?.contestId);

  const shouldShowTestSection =
    (baseAttempt?.verdict ?? 0) !== Verdicts.Accepted && (baseAttempt?.testCaseNumber ?? 0) > 1;

  const { up } = useBreakpoints();
  const upMd = up('md');

  const canPurchaseAttempt = useMemo(
    () =>
      Boolean(
        attempt &&
        currentUser &&
        !canViewAttempt &&
        !isContestAttempt &&
        attempt.kepcoinValue !== undefined &&
        attempt.kepcoinValue !== null,
      ),
    [attempt, canViewAttempt, currentUser, isContestAttempt],
  );

  const shouldShowTestPurchase = useMemo(
    () =>
      Boolean(
        baseAttempt &&
        (isOwner || currentUser?.isSuperuser) &&
        baseAttempt.verdict !== Verdicts.Accepted &&
        (baseAttempt.testCaseNumber ?? 0) > 1 &&
        !canViewTest &&
        !isContestAttempt &&
        baseAttempt.testCaseKepcoinValue !== undefined &&
        baseAttempt.testCaseKepcoinValue !== null,
      ),
    [baseAttempt, canViewTest, currentUser?.isSuperuser, isContestAttempt, isOwner],
  );

  const testViewUrl =
    baseAttempt && baseAttempt.testCaseNumber
      ? `/api/attempts/${baseAttempt.id}/failed-test/?number=${baseAttempt.testCaseNumber}`
      : null;

  const fetchDetail = useCallback(async () => {
    if (!attempt?.id || !attempt.canView) {
      setDetail(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await problemsQueries.problemsRepository.getAttempt(attempt.id);
      setDetail(data);
    } catch (error: any) {
      const fallbackMessage = t('problems.attempts.modal.loadError');
      const message = error?.response?.data?.message ?? error?.message ?? fallbackMessage;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [attempt?.canView, attempt?.id, t]);

  useEffect(() => {
    if (open) {
      fetchDetail();
    } else {
      setDetail(null);
      setIsCompareOpen(false);
    }
  }, [fetchDetail, open]);

  const handleAttemptPurchaseSuccess = async () => {
    if (!attempt) return;
    onAttemptUpdated?.(attempt.id, { canView: true });
    await fetchDetail();
  };

  const handleTestPurchaseSuccess = () => {
    if (!baseAttempt?.id) return;
    onAttemptUpdated?.(baseAttempt.id, { canTestView: true });
    setDetail((prev) => (prev ? { ...prev, canTestView: true } : prev));
  };

  const handleCopyCode = useCallback(async () => {
    if (!detail?.sourceCode) return;
    try {
      await navigator.clipboard.writeText(detail.sourceCode);
      toast.success(t('problems.detail.copied'));
    } catch {
      toast.error(t('problems.attempts.modal.loadError'));
    }
  }, [detail?.sourceCode, t]);

  if (!attempt) {
    return null;
  }

  const verdictValue = baseAttempt?.verdict as VerdictKey | undefined;
  const problemUrl =
    baseAttempt?.problemId && baseAttempt.problemId > 0
      ? getResourceById(resources.Problem, baseAttempt.problemId)
      : undefined;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Stack spacing={0.25}>
              <Typography variant="h6" fontWeight={700}>
                {t('problems.attempts.modal.title', { id: baseAttempt?.id ?? '--' })}
              </Typography>

              {upMd && (
                <Stack direction="row" spacing={1}>
                  <UserPopover username={baseAttempt?.user?.username ?? ''}>
                    <Typography fontWeight={700} color="primary">
                      {baseAttempt?.user?.username ?? '--'}
                    </Typography>
                  </UserPopover>

                  {problemUrl ? (
                    <Typography
                      component={RouterLink}
                      to={problemUrl}
                      color="inherit"
                      sx={{ textDecoration: 'none', fontWeight: 600 }}
                    >
                      {baseAttempt?.contestProblemSymbol
                        ? `${baseAttempt.contestProblemSymbol}. ${baseAttempt?.problemTitle}`
                        : `${baseAttempt?.problemId}. ${baseAttempt?.problemTitle}`}
                    </Typography>
                  ) : (
                    <Typography fontWeight={600}>{baseAttempt?.problemTitle ?? '--'}</Typography>
                  )}
                </Stack>
              )}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {canViewAttempt ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsCompareOpen(true)}
                  disabled={isLoading}
                  startIcon={<IconifyIcon icon="material-symbols:compare-rounded" />}
                >
                  {t('problems.attempts.modal.compare')}
                </Button>
              ) : null}
              <AttemptLanguage
                lang={baseAttempt?.lang || ''}
                langFull={baseAttempt?.langFull || ''}
              />
              <AttemptVerdict
                variant="filled"
                verdict={verdictValue}
                title={baseAttempt?.verdictTitle ?? ''}
                testCaseNumber={baseAttempt?.testCaseNumber}
                balls={baseAttempt?.balls}
              />
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction="column" spacing={2.5}>
            {!canViewAttempt ? (
              <Alert
                severity={canPurchaseAttempt ? 'info' : 'warning'}
                action={
                  canPurchaseAttempt ? (
                    <KepcoinSpendConfirm
                      value={attempt?.kepcoinValue ?? 0}
                      purchaseUrl={`/api/attempts/${attempt.id}/purchase/`}
                      onSuccess={handleAttemptPurchaseSuccess}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<IconifyIcon icon="mdi:lock-open-variant" />}
                      >
                        {t('problems.attempts.modal.purchaseAttempt')}
                      </Button>
                    </KepcoinSpendConfirm>
                  ) : null
                }
              >
                <Typography variant="body2" gutterBottom>
                  {t('problems.attempts.modal.lockedDescription')}
                </Typography>
                {attempt.kepcoinValue ? (
                  <Typography variant="body2" color="text.secondary">
                    <KepcoinValue value={attempt.kepcoinValue} fontWeight={700} iconSize={18} />
                  </Typography>
                ) : null}
              </Alert>
            ) : null}
            {detail?.errorMessage?.trim() ? (
              <Alert
                severity="error"
                icon={<IconifyIcon icon="mdi:alert-octagon-outline" width={20} height={20} />}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {t('problems.attempts.modal.errorTitle')}
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'auto',
                  }}
                >
                  {detail.errorMessage?.trim()}
                </Box>
              </Alert>
            ) : null}

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                minHeight: 200,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 2, pt: 1 }}
              >
                <ResponsiveTabs
                  value="code"
                  onChange={() => undefined}
                  items={[
                    {
                      value: 'code',
                      label: t('problems.detail.codeTab'),
                      tabProps: { sx: { minHeight: 36 } },
                    },
                  ]}
                  ariaLabel="attempt detail tabs"
                  tabsProps={{
                    textColor: 'primary',
                    indicatorColor: 'primary',
                    sx: { minHeight: 36 },
                  }}
                />
                {canViewAttempt && detail?.sourceCode ? (
                  <IconButton size="small" onClick={handleCopyCode}>
                    <IconifyIcon icon="mdi:content-copy" width={18} height={18} />
                  </IconButton>
                ) : null}
              </Stack>

              {isLoading ? <LinearProgress /> : null}
              <Divider />
              {canViewAttempt ? (
                detail ? (
                  <Editor
                    value={detail.sourceCode ?? ''}
                    language={mapEditorLanguage(detail.lang)}
                    height="420px"
                    theme={themeMode.mode === 'dark' ? 'vs-dark' : 'vs'}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      wordWrap: 'off',
                      automaticLayout: true,
                      lineNumbers: 'on',
                    }}
                  />
                ) : (
                  <Box p={2}></Box>
                )
              ) : (
                !isLoading && (
                  <Box p={2}>
                    <Typography color="text.secondary">
                      {t('problems.attempts.modal.lockedDescription')}
                    </Typography>
                  </Box>
                )
              )}
            </Box>

            {!isContestAttempt &&
            shouldShowTestSection &&
            (shouldShowTestPurchase || canViewTest) ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1.5}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2">
                      {t('problems.attempts.modal.failedTestTitle', {
                        number: baseAttempt?.testCaseNumber ?? '--',
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('problems.attempts.modal.failedTestDescription')}
                    </Typography>
                  </Stack>

                  {canViewTest && testViewUrl ? (
                    <Button
                      component="a"
                      href={testViewUrl}
                      target="_blank"
                      rel="noopener"
                      variant="outlined"
                      color="primary"
                      startIcon={<IconifyIcon icon="mdi:open-in-new" />}
                    >
                      {t('problems.attempts.modal.viewTest')}
                    </Button>
                  ) : shouldShowTestPurchase ? (
                    <KepcoinSpendConfirm
                      value={baseAttempt?.testCaseKepcoinValue ?? 0}
                      purchaseUrl={`/api/attempts/${baseAttempt?.id}/purchase-test/`}
                      onSuccess={handleTestPurchaseSuccess}
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<IconifyIcon icon="mdi:shield-key" />}
                      >
                        {t('problems.attempts.modal.purchaseTest')}
                      </Button>
                    </KepcoinSpendConfirm>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('problems.attempts.modal.testUnavailable')}
                    </Typography>
                  )}
                </Stack>
              </Box>
            ) : null}
          </Stack>
        </DialogContent>
      </Dialog>
      <AttemptCompareDialog
        open={isCompareOpen}
        baseAttempt={baseAttempt}
        currentDetail={detail}
        onClose={() => setIsCompareOpen(false)}
      />
    </>
  );
};

export default AttemptDetailDialog;
