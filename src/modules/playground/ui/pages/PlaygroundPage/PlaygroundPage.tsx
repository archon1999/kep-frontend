import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { examples, usePlayground } from 'modules/playground/application';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import { PointerSpotlight, ScrambleText } from 'shared/components/motion/InteractionEffects';
import { WorkspaceRoot, WorkspaceToolbar } from 'shared/components/sections/common/Workspace';
import { PlaygroundConsole } from './components/PlaygroundConsole';
import { PlaygroundEditor } from './components/PlaygroundEditor';
import './playground.css';

const PlaygroundPage = () => {
  const { t } = useTranslation();
  const model = usePlayground();
  const [playbackVersion, setPlaybackVersion] = useState(0);
  const selected = examples.find(
    (item) => item.code === model.draft.code && item.input === model.draft.input,
  );
  const run = () => {
    void model.run();
  };
  const chooseExample = (id: string) => {
    model.selectExample(id);
    setPlaybackVersion((value) => value + 1);
  };
  return (
    <Box
      className="playground-page"
      sx={{ width: '100%', maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}
    >
      <PointerSpotlight element="section" className="playground-intro">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          gap={2}
          mb={3}
        >
          <Stack direction="row" gap={2} alignItems="center">
            <Box component="img" src="/assets/keplang.svg" alt="" sx={{ width: 46, height: 46 }} />
            <Box>
              <Typography variant="h3" className="playground-title">
                <MixedText>{t('playground.title')}</MixedText>
              </Typography>
              <Typography color="text.secondary" className="playground-heading-copy">
                {t('playground.subtitle')}
              </Typography>
            </Box>
          </Stack>
          <Button
            component="a"
            href="https://lang.kep.uz/#qollanma"
            target="_blank"
            rel="noopener"
            endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
          >
            <ScrambleText>{t('playground.docs')}</ScrambleText>
          </Button>
        </Stack>
      </PointerSpotlight>
      <WorkspaceRoot className="playground-workspace" data-busy={model.busy}>
        <WorkspaceToolbar className="playground-controls">
          <Chip label="KEPLang 0.2.2" variant="outlined" size="small" />
          <TextField
            select
            size="small"
            value={selected?.id ?? 'draft'}
            label={t('playground.examples')}
            disabled={model.busy}
            onChange={(event) => chooseExample(event.target.value)}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value="draft" disabled>
              {t('playground.customDraft')}
            </MenuItem>
            {examples.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {t(`playground.example.${item.id}`)}
              </MenuItem>
            ))}
          </TextField>
          <span className="playground-shortcut">
            <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
          </span>
          <Button onClick={model.download} startIcon={<IconifyIcon icon="mdi:download" />}>
            {t('playground.download')}
          </Button>
          <Button
            className="playground-run kep-cta"
            variant="contained"
            onClick={run}
            disabled={model.busy || !model.valid}
            startIcon={<IconifyIcon icon={model.busy ? 'mdi:loading' : 'mdi:play'} />}
          >
            <ScrambleText>{t(model.busy ? 'playground.running' : 'playground.run')}</ScrambleText>
          </Button>
        </WorkspaceToolbar>
        {model.busy && <LinearProgress />}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.55fr) minmax(0, 1fr)' },
          }}
        >
          <PlaygroundEditor
            code={model.draft.code}
            busy={model.busy}
            byteLength={model.byteLength}
            valid={model.valid}
            sample={Boolean(selected)}
            playbackVersion={playbackVersion}
            onChange={model.setCode}
            onRun={run}
          />
          <PlaygroundConsole
            input={model.draft.input}
            busy={model.busy}
            result={model.result}
            stale={model.resultIsStale}
            onInput={model.setInput}
          />
        </Box>
      </WorkspaceRoot>
      {model.error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {t(`playground.errors.${model.error}`)}
        </Alert>
      )}
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mt={2}
        sx={{ fontSize: 11, lineHeight: 1.8 }}
      >
        {t('playground.limits')}
      </Typography>
    </Box>
  );
};
export default PlaygroundPage;
