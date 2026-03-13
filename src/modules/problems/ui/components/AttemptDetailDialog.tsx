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
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useBreakpoints } from 'app/providers/BreakpointsProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources';
import UserPopover from 'modules/users/ui/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import AttemptVerdict, { VerdictKey } from 'shared/components/problems/AttemptVerdict';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { toast } from 'sonner';
import { problemsQueries } from '../../application/queries';
import {
  AttemptDetail,
  AttemptLangs,
  AttemptListItem,
  Verdicts,
} from '../../domain/entities/problem.entity';

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
              <Tabs
                value="code"
                textColor="primary"
                indicatorColor="primary"
                sx={{ minHeight: 36 }}
              >
                <Tab value="code" label={t('problems.detail.codeTab')} sx={{ minHeight: 36 }} />
              </Tabs>
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

          {shouldShowTestSection && (shouldShowTestPurchase || canViewTest) ? (
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
  );
};

export default AttemptDetailDialog;
