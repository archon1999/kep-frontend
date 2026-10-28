import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import AppbarActionItems from 'app/layouts/main-layout/common/AppbarActionItems';
import { getResourceByParams, resources } from 'app/routes/resources';
import { ContestDetail } from 'modules/contests/domain/entities/contest-detail.entity';
import { ContestProblemEntity } from 'modules/contests/domain/entities/contest-problem.entity';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import MixedText from 'shared/components/common/MixedText';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';

interface ContestWorkspaceHeaderProps {
  contest?: ContestDetail;
  contestId?: number;
  problems: ContestProblemEntity[];
  symbol?: string;
  timeLeft: string;
  upsolveHref?: string;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  hasCode: boolean;
  isLocked: boolean;
}

const ContestWorkspaceHeader = ({
  contest,
  contestId,
  problems,
  symbol,
  timeLeft,
  upsolveHref,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
  hasCode,
  isLocked,
}: ContestWorkspaceHeaderProps) => {
  const { t } = useTranslation();
  const problemsHref = getResourceByParams(resources.ContestProblems, { id: contestId ?? '' });
  return (
    <Box component="header" sx={{ flexShrink: 0, minWidth: 0, bgcolor: 'background.default' }}>
      <Stack
        direction="row"
        alignItems="center"
        gap={{ xs: 1.5, md: 3 }}
        sx={{
          px: { xs: 2, md: 3 },
          minHeight: 52,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Logo showName={false} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            component={RouterLink}
            to={problemsHref}
            title={contest?.title}
            sx={{
              display: 'block',
              width: 'fit-content',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'text.primary',
              textDecoration: 'none',
              fontFamily: 'var(--kep-display-font)',
              fontSize: 18,
              lineHeight: 1.3,
              '&:hover': { color: 'primary.main' },
            }}
          >
            <MixedText>{contest?.title ?? t('contests.title')}</MixedText>
          </Typography>
        </Box>
        <Stack direction="row" gap={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Tooltip title={t('problems.detail.runHotkey')}>
            <span>
              <Button
                variant="outlined"
                onClick={onRun}
                disabled={isRunning || !hasCode || isLocked}
                loading={isRunning}
                startIcon={<IconifyIcon icon="mdi:play-outline" />}
              >
                {t('problems.detail.run')}
              </Button>
            </span>
          </Tooltip>
          <Tooltip title={t('problems.detail.submitHotkey')}>
            <span>
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={isSubmitting || !hasCode || isLocked}
                loading={isSubmitting}
                endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
              >
                <ScrambleText>{t('problems.detail.submit')}</ScrambleText>
              </Button>
            </span>
          </Tooltip>
        </Stack>
        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            pl: 3,
            borderLeft: 1,
            borderColor: 'divider',
          }}
        >
          <AppbarActionItems type="slim" />
        </Box>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Tooltip title={t('contests.tabs.standings')}>
            <IconButton
              component={RouterLink}
              to={getResourceByParams(resources.ContestStandings, { id: contestId ?? '' })}
              aria-label={t('contests.tabs.standings')}
            >
              <IconifyIcon icon="mdi:podium" />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        gap={{ xs: 1, md: 2 }}
        sx={{ px: { xs: 1, md: 3 }, borderBottom: 1, borderColor: 'divider', minHeight: 40 }}
      >
        <Tooltip title={t('contests.tabs.problems')}>
          <IconButton
            component={RouterLink}
            to={problemsHref}
            aria-label={t('contests.tabs.problems')}
            size="small"
          >
            <IconifyIcon icon="mdi:format-list-bulleted" />
          </IconButton>
        </Tooltip>
        <Box
          component="nav"
          aria-label={t('problems.workspace.problemNavigation')}
          sx={{
            display: 'flex',
            flex: 1,
            minWidth: 0,
            overflowX: 'auto',
            gap: 0.5,
            py: 0.25,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {problems.map((item) => (
            <Tooltip key={item.symbol} title={item.problem.title}>
              <Button
                component={RouterLink}
                to={getResourceByParams(resources.ContestProblem, {
                  id: contestId ?? '',
                  symbol: item.symbol,
                })}
                aria-label={item.symbol + '. ' + item.problem.title}
                aria-current={item.symbol === symbol ? 'page' : undefined}
                variant="text"
                sx={{
                  position: 'relative',
                  minWidth: 38,
                  height: 34,
                  p: 0.75,
                  borderRadius: 0,
                  fontFamily: 'var(--kep-display-font)',
                  fontSize: 15,
                  color:
                    item.symbol === symbol
                      ? 'primary.main'
                      : item.isSolved
                        ? 'success.main'
                        : 'text.secondary',
                  bgcolor: item.symbol === symbol ? 'action.selected' : 'transparent',
                  boxShadow: item.symbol === symbol ? 'inset 0 -2px var(--kep-logo-ice)' : 'none',
                  '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
                }}
              >
                {item.symbol}
                {item.isSolved && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 3,
                      right: 3,
                      width: 3,
                      height: 3,
                      bgcolor: 'success.main',
                    }}
                  />
                )}
              </Button>
            </Tooltip>
          ))}
        </Box>
        <Stack direction="row" gap={0.25}>
          <Tooltip title={t('contests.problem.prev')}>
            <span>
              <IconButton
                size="small"
                onClick={onPrev}
                disabled={!hasPrev}
                aria-label={t('contests.problem.prev')}
              >
                <IconifyIcon icon="mdi:chevron-left" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('contests.problem.next')}>
            <span>
              <IconButton
                size="small"
                onClick={onNext}
                disabled={!hasNext}
                aria-label={t('contests.problem.next')}
              >
                <IconifyIcon icon="mdi:chevron-right" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
        <Stack
          direction="row"
          gap={1.5}
          alignItems="center"
          sx={{ display: { xs: 'none', md: 'flex' }, pl: 2, borderLeft: 1, borderColor: 'divider' }}
        >
          {timeLeft ? (
            <Typography
              variant="metric"
              color="primary.main"
              sx={{ fontSize: 18, whiteSpace: 'nowrap' }}
            >
              {timeLeft}
            </Typography>
          ) : contest ? (
            <Chip
              size="small"
              variant="status"
              label={t(
                contest.statusCode === ContestStatus.Finished
                  ? 'contests.statusShort.finished'
                  : contest.statusCode === ContestStatus.Already
                    ? 'contests.statusShort.live'
                    : 'contests.statusShort.notStarted',
              )}
            />
          ) : null}
          <Button
            component={RouterLink}
            to={getResourceByParams(resources.ContestStandings, { id: contestId ?? '' })}
            size="small"
            variant="text"
            startIcon={<IconifyIcon icon="mdi:podium" />}
          >
            {t('contests.tabs.standings')}
          </Button>
          {upsolveHref && (
            <Tooltip title={t('contests.problem.openOriginal')}>
              <IconButton
                size="small"
                component={RouterLink}
                to={upsolveHref}
                aria-label={t('contests.problem.openOriginal')}
              >
                <IconifyIcon icon="mdi:open-in-new" fontSize={18} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        {timeLeft && (
          <Typography
            variant="metric"
            color="primary.main"
            sx={{ display: { md: 'none' }, fontSize: 14 }}
          >
            {timeLeft}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default ContestWorkspaceHeader;
