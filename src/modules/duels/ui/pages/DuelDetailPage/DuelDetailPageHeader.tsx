import { Box, Button, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppbarActionItems from 'app/layouts/main-layout/common/AppbarActionItems';
import { resources } from 'app/routes/resources';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo.tsx';
import { Duel } from 'modules/duels/domain/index.ts';
import { DuelDetailPageNavigationProblem } from './DuelDetailPage.models.ts';

export type DuelDetailPageHeaderProps = {
  duel: Duel;
  timerText: string;
  prevProblem: DuelDetailPageNavigationProblem | null;
  nextProblem: DuelDetailPageNavigationProblem | null;
  hasCurrentUser: boolean;
  hasCode: boolean;
  isRunning: boolean;
  isSubmitting: boolean;
  isWorkspaceLocked: boolean;
  onRun: () => void;
  onSubmit: () => void;
  onSelectProblem: (symbol: string) => void;
};

const DuelDetailPageHeader = ({
  duel,
  timerText,
  prevProblem,
  nextProblem,
  hasCurrentUser,
  hasCode,
  isRunning,
  isSubmitting,
  isWorkspaceLocked,
  onRun,
  onSubmit,
  onSelectProblem,
}: DuelDetailPageHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Box
      component="header"
      sx={{
        px: { xs: 2, md: 3 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
        <Logo showName={false} />

        <Divider orientation="vertical" flexItem />

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: 0 }}>
          {timerText ? (
            <Chip
              icon={<IconifyIcon icon="mdi:timer-outline" width={18} height={18} />}
              label={timerText}
              color="primary"
              variant="soft"
              size="medium"
              sx={{
                '& .MuiChip-label': {
                  fontFamily:
                    'Roboto Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                },
              }}
            />
          ) : null}

          <Button
            component={RouterLink}
            to={resources.Duels}
            startIcon={<IconifyIcon icon="mdi:sword-cross" width={18} height={18} />}
            variant="text"
            color="primary"
            sx={{ textTransform: 'none' }}
          >
            {t('duels.title')}
          </Button>

          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.18)' }} />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            sx={{ minWidth: 0 }}
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Stack direction="row" spacing={0.75} alignItems="center">
                {duel.playerFirst.ratingTitle ? (
                  <ContestsRatingChip title={duel.playerFirst.ratingTitle} imgSize={20} />
                ) : null}
                <Typography variant="subtitle2" fontWeight={800} noWrap>
                  {duel.playerFirst.username}
                </Typography>
                {duel.playerFirst.isBot ? (
                  <Chip size="small" color="secondary" variant="outlined" label="BOT" />
                ) : null}
              </Stack>

              <Typography variant="body2" color="text.secondary">
                vs
              </Typography>

              {duel.playerSecond ? (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  {duel.playerSecond.ratingTitle ? (
                    <ContestsRatingChip title={duel.playerSecond.ratingTitle} imgSize={20} />
                  ) : null}
                  <Typography variant="subtitle2" fontWeight={800} noWrap>
                    {duel.playerSecond.username}
                  </Typography>
                  {duel.playerSecond.isBot ? (
                    <Chip size="small" color="secondary" variant="outlined" label="BOT" />
                  ) : null}
                </Stack>
              ) : null}
            </Stack>

            {duel.duelType?.title ? (
              <Chip size="small" color="primary" variant="outlined" label={duel.duelType.title} />
            ) : null}
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title={t('contests.problem.prev')}>
              <span style={{ display: 'inline-flex' }}>
                <Button
                  onClick={() => prevProblem && onSelectProblem(prevProblem.symbol)}
                  variant="text"
                  color="primary"
                  disabled={!prevProblem}
                  startIcon={<IconifyIcon icon="mdi:chevron-left" width={18} height={18} />}
                />
              </span>
            </Tooltip>
            <Tooltip title={t('contests.problem.next')}>
              <span style={{ display: 'inline-flex' }}>
                <Button
                  onClick={() => nextProblem && onSelectProblem(nextProblem.symbol)}
                  variant="text"
                  color="primary"
                  disabled={!nextProblem}
                  endIcon={<IconifyIcon icon="mdi:chevron-right" width={18} height={18} />}
                />
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{ flex: 1, minWidth: 0 }}
      >
        <Tooltip title={t('problems.detail.runHotkey')}>
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={onRun}
              disabled={!hasCurrentUser || isRunning || !hasCode || isWorkspaceLocked}
              startIcon={<IconifyIcon icon="mdi:play-circle-outline" width={20} height={20} />}
            >
              {t('problems.detail.run')}
            </Button>
          </span>
        </Tooltip>

        <Tooltip title={t('problems.detail.submitHotkey')}>
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onSubmit}
              disabled={!hasCurrentUser || isSubmitting || !hasCode || isWorkspaceLocked}
              startIcon={<IconifyIcon icon="mdi:send-outline" width={18} height={18} />}
            >
              {t('problems.detail.submit')}
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <AppbarActionItems type="slim" />
      </Box>
    </Box>
  );
};

export default DuelDetailPageHeader;
