import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
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
import {
  WorkspacePane,
  WorkspaceRoot,
  WorkspaceToolbar,
} from 'shared/components/sections/common/Workspace';
import { useMonacoTheme } from 'shared/hooks/useMonacoTheme';

const PlaygroundPage = () => {
  const { t } = useTranslation();
  const model = usePlayground();
  const editorTheme = useMonacoTheme();
  const { result } = model;
  const verdict = result?.verdict;
  const resultKey = model.busy
    ? (result?.status ?? 'queued')
    : result?.status === 'finished'
      ? verdict === 1
        ? 'success'
        : verdict === 8
          ? 'compileError'
          : verdict === 3 || verdict === 10
            ? 'timeLimit'
            : verdict === 6
              ? 'memoryLimit'
              : 'runtimeError'
      : result?.status === 'expired'
        ? 'expired'
        : result?.status === 'failed'
          ? 'failed'
          : 'ready';

  return (
    <Box sx={{ width: '100%', maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2} mb={3}>
        <Stack direction="row" gap={2} alignItems="center">
          <Box component="img" src="/assets/keplang.svg" alt="" sx={{ width: 50, height: 50 }} />
          <Box>
            <Typography variant="h3">{t('playground.title')}</Typography>
            <Typography color="text.secondary" variant="body2">
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
          {t('playground.docs')}
        </Button>
      </Stack>
      <WorkspaceRoot>
        <WorkspaceToolbar sx={{ gap: 1.5, flexWrap: 'wrap', p: 2 }}>
          <Chip label="KEPLang 0.2.2" variant="outlined" />
          <TextField
            select
            size="small"
            defaultValue="sum"
            label={t('playground.examples')}
            disabled={model.busy}
            onChange={(event) => model.selectExample(event.target.value)}
            sx={{ minWidth: 170 }}
          >
            {examples.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {t(`playground.example.${item.id}`)}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ flex: 1 }} />
          <Button onClick={model.download} startIcon={<IconifyIcon icon="mdi:download" />}>
            {t('playground.download')}
          </Button>
          <Button
            variant="contained"
            onClick={model.run}
            disabled={model.busy || !model.valid}
            startIcon={<IconifyIcon icon={model.busy ? 'mdi:loading' : 'mdi:play'} />}
          >
            {t(model.busy ? 'playground.running' : 'playground.run')}
          </Button>
        </WorkspaceToolbar>
        {model.busy && <LinearProgress />}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.5fr) minmax(0, 1fr)' },
          }}
        >
          <WorkspacePane sx={{ minWidth: 0, borderRight: { lg: 1 }, borderColor: 'divider' }}>
            <WorkspaceToolbar sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                main.kep
              </Typography>
              <Typography variant="caption" color={model.valid ? 'text.secondary' : 'error'}>
                {model.byteLength} / 30000 B
              </Typography>
            </WorkspaceToolbar>
            <Editor
              height="520px"
              language="keplang"
              theme={editorTheme.theme}
              beforeMount={editorTheme.beforeMount}
              value={model.draft.code}
              onChange={(value) => model.setCode(value ?? '')}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                ariaLabel: t('playground.editor'),
                readOnly: model.busy,
              }}
            />
          </WorkspacePane>
          <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <WorkspacePane sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                multiline
                minRows={5}
                maxRows={8}
                label={t('playground.input')}
                value={model.draft.input}
                disabled={model.busy}
                onChange={(event) => model.setInput(event.target.value)}
                slotProps={{
                  htmlInput: {
                    maxLength: 65536,
                    spellCheck: false,
                    style: { fontFamily: 'monospace' },
                  },
                }}
              />
            </WorkspacePane>
            <WorkspacePane sx={{ p: 2.5, flex: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                gap={1}
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">{t('playground.output')}</Typography>
                <Chip
                  size="small"
                  label={t(`playground.status.${resultKey}`)}
                  color={
                    verdict === 1 && !model.busy
                      ? 'success'
                      : verdict && verdict !== 1
                        ? 'error'
                        : 'default'
                  }
                />
              </Stack>
              <Box
                component="pre"
                aria-live="polite"
                sx={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  m: 0,
                  minHeight: 150,
                  fontSize: 14,
                  color: result?.error ? 'error.main' : 'text.primary',
                }}
              >
                {result?.output || result?.error || t('playground.empty')}
              </Box>
              {result?.output && result.error && (
                <Box component="pre" sx={{ whiteSpace: 'pre-wrap', color: 'error.main' }}>
                  {result.error}
                </Box>
              )}
              {result?.status === 'finished' && (
                <Typography variant="caption" color="text.secondary">
                  {result.time} ms · {result.memory} MB
                </Typography>
              )}
            </WorkspacePane>
          </Box>
        </Box>
      </WorkspaceRoot>
      {model.error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {t(`playground.errors.${model.error}`)}
        </Alert>
      )}
      <Typography variant="caption" color="text.secondary" display="block" mt={2}>
        {t('playground.limits')}
      </Typography>
    </Box>
  );
};
export default PlaygroundPage;
