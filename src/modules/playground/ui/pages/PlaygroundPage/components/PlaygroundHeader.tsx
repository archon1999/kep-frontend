import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Divider, Stack, Tooltip, Typography } from '@mui/material';
import LanguageMenu from 'app/layouts/main-layout/common/LanguageMenu';
import ThemeToggler from 'app/layouts/main-layout/common/ThemeToggler';
import { resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import MixedText from 'shared/components/common/MixedText';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';

export const PlaygroundRunButton = ({
  busy,
  disabled,
  onRun,
}: {
  busy: boolean;
  disabled: boolean;
  onRun: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Tooltip title={t('playground.runShortcut')}>
      <span>
        <Button
          variant="contained"
          className="kep-cta"
          disabled={disabled || busy}
          onClick={onRun}
          loading={busy}
          startIcon={<IconifyIcon icon="mdi:play-outline" />}
        >
          <ScrambleText>{t(busy ? 'playground.running' : 'playground.run')}</ScrambleText>
        </Button>
      </span>
    </Tooltip>
  );
};

export const PlaygroundHeader = ({
  busy,
  valid,
  onRun,
}: {
  busy: boolean;
  valid: boolean;
  onRun: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Box component="header" className="runner-header">
      <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.5 }} minWidth={0}>
        <Logo showName={false} />
        <Divider orientation="vertical" flexItem />
        <Typography component="h1" className="runner-title">
          <MixedText>{t('playground.title')}</MixedText>
        </Typography>
        <Button
          component={RouterLink}
          to={resources.Problems}
          size="small"
          className="runner-problems-link"
          startIcon={<IconifyIcon icon="mdi:format-list-bulleted" />}
        >
          {t('problems.title')}
        </Button>
      </Stack>
      <Stack direction="row" alignItems="center" gap={1}>
        <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 1 }}>
          <PlaygroundRunButton busy={busy} disabled={!valid} onRun={onRun} />
        </Box>
        <LanguageMenu type="slim" />
        <ThemeToggler type="slim" />
      </Stack>
    </Box>
  );
};
