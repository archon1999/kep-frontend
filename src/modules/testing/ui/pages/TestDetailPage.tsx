import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { toast } from 'sonner';
import KepIcon from 'shared/components/base/KepIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { startTest } from '../../application/mutations.ts';
import { useTestDetail, useTestResults } from '../../application/queries.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';

type MetricItem = {
  key: string;
  label: string;
  value: string | number;
  icon: Parameters<typeof KepIcon>[0]['name'];
};

const TestDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: test, isLoading } = useTestDetail(id);
  const { data: results, isLoading: isResultsLoading } = useTestResults(id);
  const [canStart, setCanStart] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useDocumentTitle(
    test ? 'pageTitles.test' : undefined,
    test
      ? {
          testTitle: test.title ?? '',
        }
      : undefined,
  );

  useEffect(() => {
    if (test?.canStart !== undefined) {
      setCanStart(Boolean(test.canStart));
    }
  }, [test?.canStart]);

  const questionsCount = test?.questionsCount ?? test?.questions?.length ?? 0;

  const metrics: MetricItem[] = useMemo(
    () => [
      {
        key: 'questions',
        label: t('tests.questions'),
        value: questionsCount,
        icon: 'question',
      },
      {
        key: 'duration',
        label: t('tests.durationLabel'),
        value: test?.duration || '—',
        icon: 'challenge-time',
      },
      {
        key: 'difficulty',
        label: t('tests.difficulty'),
        value: test?.difficultyTitle || '—',
        icon: 'difficulty',
      },
      {
        key: 'passes',
        label: t('tests.passes'),
        value: test?.passesCount ?? 0,
        icon: 'attempt',
      },
    ],
    [t, questionsCount, test?.duration, test?.difficultyTitle, test?.passesCount],
  );

  const handleStart = async () => {
    if (!test) return;

    setIsStarting(true);

    try {
      const response = await startTest(test.id);

      if (response.success && response.testPassId) {
        navigate(getResourceById(resources.TestPass, response.testPassId));
        return;
      }

      toast.error(t('tests.startError'));
    } catch {
      toast.error(t('tests.startError'));
    } finally {
      setIsStarting(false);
    }
  };

  const renderStartButton = (enableStart: boolean) => (
    <Button
      variant="contained"
      size="large"
      onClick={enableStart ? handleStart : undefined}
      fullWidth
      disabled={enableStart && isStarting}
      sx={{ py: 1.25, fontWeight: 700 }}
    >
      {enableStart && isStarting ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        t('tests.start')
      )}
    </Button>
  );

  const renderSkeleton = () => (
    <Box sx={{ ...responsivePagePaddingSx }}>
      <Stack direction="column" spacing={3}>
        <Card
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(79,70,229,0.9), rgba(14,165,233,0.9))',
            color: 'common.white',
            boxShadow: '0 18px 40px rgba(0,0,0,0.15)',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 4 },
            }}
          >
            <Grid container size={12} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Skeleton variant="circular" width={56} height={56} sx={{ borderRadius: 2 }} />
                  <Stack direction="column" spacing={0.75} sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="30%" height={20} />
                    <Skeleton variant="text" width="70%" height={28} />
                  </Stack>
                </Stack>
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  {[1, 2, 3].map((chip) => (
                    <Skeleton key={chip} variant="rounded" width={72} height={28} />
                  ))}
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 2.5, boxShadow: 6 }}>
                  <Stack direction="column" spacing={1.5}>
                    <Skeleton variant="rounded" height={48} />
                    <Divider />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="70%" />
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
              <Card
                sx={{ height: '100%', borderRadius: 2, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Skeleton variant="rounded" width={44} height={44} />
                    <Stack direction="row" spacing={0.5} sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {[1, 2].map((item) => (
            <Grid size={{ xs: 12, lg: 6 }} key={item}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width="30%" />
                  </Stack>
                  {[1, 2, 3].map((row) => (
                    <Skeleton
                      key={row}
                      variant="rounded"
                      height={52}
                      sx={{ mb: row === 3 ? 0 : 1, borderRadius: 1 }}
                    />
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );

  if (isLoading || !test) {
    return renderSkeleton();
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Card
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(79,70,229,0.9), rgba(14,165,233,0.9))',
            color: 'common.white',
            boxShadow: '0 18px 40px rgba(0,0,0,0.15)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(120% 120% at 80% 0%, rgba(255,255,255,0.16), transparent)',
            }}
          />
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 4 },
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
                  <Button
                    component={RouterLink}
                    to={resources.Tests}
                    startIcon={<IconifyIcon icon="mdi:arrow-left"/>}
                    sx={{
                      alignSelf: 'flex-start',
                      px: 0,
                      color: 'rgba(255,255,255,0.85)',
                      textTransform: 'none',
                      fontWeight: 700,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'common.white',
                      },
                    }}
                  >
                    {t('tests.backToList')}
                  </Button>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={test.chapter.icon}
                      variant="rounded"
                      sx={{ width: 56, height: 56, border: '2px solid rgba(255,255,255,0.35)' }}
                    />
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                        {test.chapter.title}
                      </Typography>
                      <Typography variant="h5" fontWeight={800}>
                        {test.title}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  {test.description}
                </Typography>

                {test.tags?.length ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                    {test.tags.map((tag) => (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.08)',
                          color: 'common.white',
                          border: '1px solid rgba(255,255,255,0.18)',
                        }}
                      />
                    ))}
                  </Stack>
                ) : null}
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    p: 2.5,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 6,
                  }}
                >
                  <Stack direction="column" spacing={1.5}>
                    {canStart ? (
                      renderStartButton(true)
                    ) : (
                      <KepcoinSpendConfirm
                        value={1}
                        purchaseUrl={`/api/tests/${test.id}/purchase/`}
                        onSuccess={() => setCanStart(true)}
                        disabled={isStarting}
                      >
                        {renderStartButton(false)}
                      </KepcoinSpendConfirm>
                    )}

                    <Divider />

                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('tests.bestResult')}
                      </Typography>
                      <Typography variant="h4" fontWeight={800}>
                        {test.userBestResult ?? 0}/{questionsCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('tests.lastPass')}: {test.lastPassed || t('tests.notPassed')}
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Grid container spacing={2}>
          {metrics.map((metric) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={metric.key}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 1.5,
                        bgcolor: 'background.neutral',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <KepIcon name={metric.icon} fontSize={22} />
                    </Box>
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {metric.label}
                      </Typography>
                      <Typography variant="h6" fontWeight={800}>
                        {metric.value}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <KepIcon name="rating" fontSize={22} />
                    <Typography variant="h6" fontWeight={800}>
                      {t('tests.recentResults')}
                    </Typography>
                  </Stack>
                  {isResultsLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Stack direction="column" spacing={1}>
                      {(results?.bestResults ?? []).map((result) => (
                        <Stack
                          key={`${result.username}-${result.finished}`}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            p: 1.25,
                            borderRadius: 1,
                            bgcolor: 'background.neutral',
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {result.username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {result.result}/{questionsCount}
                          </Typography>
                        </Stack>
                      ))}
                      {!results?.bestResults?.length ? (
                        <Typography variant="body2" color="text.secondary">
                          {t('tests.emptyTitle')}
                        </Typography>
                      ) : null}
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <KepIcon name="attempt" fontSize={22} />
                    <Typography variant="h6" fontWeight={800}>
                      {t('tests.lastAttempts')}
                    </Typography>
                  </Stack>
                  <Stack direction="column" spacing={1}>
                    {(results?.lastResults ?? []).map((result) => (
                      <Stack
                        key={`${result.username}-${result.finished}`}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          p: 1.25,
                          borderRadius: 1,
                          bgcolor: 'background.neutral',
                        }}
                      >
                        <Stack direction="column" spacing={0.25}>
                          <Typography variant="body2" fontWeight={600}>
                            {result.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {result.finished}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {result.result}/{questionsCount}
                        </Typography>
                      </Stack>
                    ))}
                    {!results?.lastResults?.length ? (
                      <Typography variant="body2" color="text.secondary">
                        {t('tests.emptyTitle')}
                      </Typography>
                    ) : null}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default TestDetailPage;
