import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useBreakpoints } from 'app/providers/BreakpointsProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources';
import { getAttemptDetails } from 'modules/problems/application/queries';
import {
  AttemptDetail,
  AttemptLangs,
  AttemptListItem,
  Verdicts,
} from 'modules/problems/domain/entities/problem.entity';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ClipboardButton from 'shared/components/common/ClipboardButton';
import DialogHeader from 'shared/components/common/DialogHeader';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import AttemptVerdict from 'shared/components/problems/AttemptVerdict';
import { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import { useMonacoTheme } from 'shared/hooks/useMonacoTheme';
import { useScopedAsyncTask } from 'shared/hooks/useScopedAsyncTask';
import { toast } from 'sonner';
import AttemptDiffEditor from './AttemptDiffEditor';

const mapEditorLanguage = (lang?: string) => {
  switch (lang) {
    case AttemptLangs.KEP:
      return 'keplang';
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
  const { up } = useBreakpoints();
  const upMd = up('md');
  const [previousAttemptId, setPreviousAttemptId] = useState('');
  const [currentAttemptId, setCurrentAttemptId] = useState('');
  const [previousSourceCode, setPreviousSourceCode] = useState('');
  const [currentSourceCode, setCurrentSourceCode] = useState('');
  const [editorLanguage, setEditorLanguage] = useState(mapEditorLanguage(baseAttempt?.lang));
  const { isPending: isLoading, run: runComparison } = useScopedAsyncTask(
    open ? `compare:${baseAttempt?.id}` : 'closed',
  );

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

      return getAttemptDetails(id);
    },
    [currentDetail],
  );

  const loadComparison = useCallback(
    (previousValue: string, currentValue: string) => {
      let previousId: number | null = null;
      let currentId: number | null = null;

      try {
        previousId = parseAttemptId(previousValue);
        currentId = parseAttemptId(currentValue);
      } catch (error: any) {
        toast.error(error?.message ?? t('problems.attempts.modal.loadError'));
        return;
      }

      void runComparison(
        () =>
          Promise.all([
            previousId ? fetchAttemptDetail(previousId) : Promise.resolve(null),
            currentId ? fetchAttemptDetail(currentId) : Promise.resolve(null),
          ]),
        {
          onSuccess: ([previousAttempt, currentAttempt]) => {
            setPreviousSourceCode(previousAttempt?.sourceCode ?? '');
            setCurrentSourceCode(currentAttempt?.sourceCode ?? '');
            setEditorLanguage(
              mapEditorLanguage(
                currentAttempt?.lang ?? previousAttempt?.lang ?? baseAttempt?.lang,
              ),
            );
          },
          onError: (error: any) => {
            const fallbackMessage = t('problems.attempts.modal.loadError');
            toast.error(error?.data?.message ?? error?.message ?? fallbackMessage);
          },
        },
      );
    },
    [baseAttempt?.lang, fetchAttemptDetail, parseAttemptId, runComparison, t],
  );

  useEffect(() => {
    if (!open) return;

    const nextPreviousId = currentDetail?.previousAttemptId
      ? String(currentDetail.previousAttemptId)
      : '';
    const nextCurrentId = baseAttempt?.id ? String(baseAttempt.id) : '';

    setPreviousAttemptId(nextPreviousId);
    setCurrentAttemptId(nextCurrentId);
    setPreviousSourceCode('');
    setCurrentSourceCode('');
    loadComparison(nextPreviousId, nextCurrentId);
  }, [baseAttempt?.id, currentDetail?.previousAttemptId, loadComparison, open]);

  const handleCompare = () => {
    if (!isLoading) loadComparison(previousAttemptId, currentAttemptId);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      aria-labelledby="attempt-compare-title"
    >
      <DialogHeader
        id="attempt-compare-title"
        title={t('problems.attempts.modal.compareTitle', { id: baseAttempt?.id ?? '--' })}
        onClose={onClose}
      />

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
              aria-disabled={isLoading}
              startIcon={<IconifyIcon icon="material-symbols:compare-rounded" />}
              sx={{ minWidth: 140, '&[aria-disabled="true"]': { opacity: 0.65 } }}
            >
              {t('problems.attempts.modal.compare')}
            </Button>
          </Stack>
        </Box>

        {isLoading ? <LinearProgress /> : null}

        <Box sx={{ height: { xs: '60vh', md: '68vh' }, minHeight: 420 }}>
          <AttemptDiffEditor
            original={previousSourceCode}
            modified={currentSourceCode}
            language={editorLanguage}
            sideBySide={upMd}
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
  const codeTheme = useMonacoTheme();
  const { currentUser } = useAuth();
  const [loadedDetail, setDetail] = useState<AttemptDetail | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const detailId = open && attempt?.canView ? attempt.id : undefined;
  const { isPending: isLoading, run: runDetail } = useScopedAsyncTask(
    detailId ? `attempt:${detailId}` : 'closed',
  );
  const detail = loadedDetail?.id === detailId ? loadedDetail : null;
  const baseAttempt = detail ?? attempt;
  const canViewAttempt = Boolean(baseAttempt?.canView);
  const canViewTest = Boolean(baseAttempt?.canTestView);
  const isOwner =
    Boolean(currentUser?.username) && baseAttempt?.user?.username === currentUser?.username;
  const isContestAttempt = Boolean(baseAttempt?.contestId);
  const isGraderAttempt = ['grader', 'ioi'].includes(baseAttempt?.judgeSummary?.mode ?? '');

  const shouldShowTestSection =
    !isGraderAttempt &&
    (baseAttempt?.verdict ?? 0) !== Verdicts.Accepted &&
    (baseAttempt?.testCaseNumber ?? 0) > 1;

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

  useEffect(() => {
    if (!detailId) {
      setDetail(null);
      setIsCompareOpen(false);
      return;
    }

    void runDetail(() => getAttemptDetails(detailId), {
      onSuccess: setDetail,
      onError: (error: any) => {
        const fallbackMessage = t('problems.attempts.modal.loadError');
        toast.error(error?.data?.message ?? error?.message ?? fallbackMessage);
      },
    });
  }, [detailId, runDetail, t]);

  const handleAttemptPurchaseSuccess = () => {
    if (!attempt) return;
    onAttemptUpdated?.(attempt.id, { canView: true });
  };

  const handleTestPurchaseSuccess = () => {
    if (!baseAttempt?.id) return;
    onAttemptUpdated?.(baseAttempt.id, { canTestView: true });
    setDetail((prev) => (prev?.id === baseAttempt.id ? { ...prev, canTestView: true } : prev));
  };

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
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        fullScreen={!upMd}
        aria-labelledby="attempt-detail-title"
      >
        <DialogHeader
          id="attempt-detail-title"
          title={t('problems.attempts.modal.title', { id: baseAttempt?.id ?? '--' })}
          onClose={onClose}
          actionsPlacement="end"
          subtitle={
            <>
              {upMd && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
            </>
          }
          actions={
            <>
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
                showBalls={isGraderAttempt}
              />
            </>
          }
        />

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
                    borderRadius: 0,
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
                borderRadius: 0,
                overflow: 'hidden',
                position: 'relative',
                minHeight: 200,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1}
                sx={{ px: 2, py: 0.75, minHeight: 48 }}
              >
                <Typography component="h3" variant="subtitle2">
                  {t('problems.detail.codeTab')}
                </Typography>
                {canViewAttempt && detail?.sourceCode ? (
                  <ClipboardButton key={detail.id} text={detail.sourceCode} />
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
                    loading={t('common.loading')}
                    theme={codeTheme.theme}
                    beforeMount={codeTheme.beforeMount}
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
                  borderRadius: 0,
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
        open={open && isCompareOpen}
        baseAttempt={baseAttempt}
        currentDetail={detail}
        onClose={() => setIsCompareOpen(false)}
      />
    </>
  );
};

export default AttemptDetailDialog;
