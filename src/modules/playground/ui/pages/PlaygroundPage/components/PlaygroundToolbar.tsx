import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, MenuItem, Stack, TextField, Tooltip } from '@mui/material';
import { examples, usePlayground } from 'modules/playground/application';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { WorkspaceToolbar } from 'shared/components/sections/common/Workspace';
import { toast } from 'sonner';

type Props = {
  model: ReturnType<typeof usePlayground>;
  sideBySide: boolean;
  onLayout: () => void;
  onExample: (id: string) => void;
};
export const PlaygroundToolbar = ({ model, sideBySide, onLayout, onExample }: Props) => {
  const { t } = useTranslation();
  const samples =
    model.selectedLang === 'kep'
      ? examples
      : [{ id: 'sum', code: model.language.template, input: '3 5\n' }];
  const selected = samples.find(
    (item) => item.code === model.draft.code && item.input === model.draft.input,
  );
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 30000) {
      toast.error(t('playground.fileTooLarge'));
      return;
    }
    const language = model.languages.find(
      (item) => item.extension === file.name.split('.').pop()?.toLowerCase(),
    );
    if (!language) {
      toast.error(t('problems.detail.unsupportedFileExtension'));
      return;
    }
    try {
      model.importCode(language.id, await file.text());
    } catch {
      toast.error(t('playground.fileFailed'));
    }
  };
  return (
    <WorkspaceToolbar
      className="runner-toolbar"
      component="nav"
      aria-label={t('playground.controls')}
    >
      <TextField
        select
        size="small"
        label={t('playground.programmingLanguage')}
        value={model.selectedLang}
        onChange={(event) => model.changeLanguage(event.target.value)}
        disabled={model.busy || !model.languageReady}
        slotProps={{
          select: { inputProps: { 'aria-label': t('playground.programmingLanguage') } },
        }}
        sx={{ minWidth: { xs: 145, sm: 180 }, maxWidth: 230 }}
      >
        {model.languages.map((language) => (
          <MenuItem key={language.id} value={language.id}>
            {language.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        size="small"
        label={t('playground.examples')}
        value={selected?.id ?? 'draft'}
        onChange={(event) => onExample(event.target.value)}
        disabled={model.busy}
        sx={{ minWidth: { xs: 115, sm: 170 }, maxWidth: 260, flex: { xs: 1, sm: 'none' } }}
      >
        <MenuItem value="draft" disabled>
          {t('playground.customDraft')}
        </MenuItem>
        {samples.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {t(`playground.example.${item.id}`)}
          </MenuItem>
        ))}
      </TextField>
      <Stack direction="row" alignItems="center" gap={0.5} sx={{ ml: { xs: 0, sm: 'auto' } }}>
        <Tooltip title={t('problems.detail.uploadFile')}>
          <IconButton
            component="label"
            size="small"
            aria-label={t('problems.detail.uploadFile')}
            disabled={model.busy || !model.languageReady}
          >
            <IconifyIcon icon="mdi:upload" />
            <input
              type="file"
              hidden
              onChange={(event) => void upload(event)}
              disabled={model.busy || !model.languageReady}
              accept={model.languages.map((item) => `.${item.extension}`).join(',')}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('playground.download')}>
          <IconButton size="small" onClick={model.download} aria-label={t('playground.download')}>
            <IconifyIcon icon="mdi:download" />
          </IconButton>
        </Tooltip>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Tooltip title={t(sideBySide ? 'playground.stackPanels' : 'playground.splitPanels')}>
            <IconButton
              size="small"
              onClick={onLayout}
              aria-label={t(sideBySide ? 'playground.stackPanels' : 'playground.splitPanels')}
            >
              <IconifyIcon
                icon={sideBySide ? 'mdi:view-agenda-outline' : 'mdi:view-column-outline'}
              />
            </IconButton>
          </Tooltip>
        </Box>
        {model.selectedLang === 'kep' && (
          <Tooltip title={t('playground.docs')}>
            <IconButton
              component="a"
              href="https://lang.kep.uz/#qollanma"
              target="_blank"
              rel="noopener"
              size="small"
              aria-label={t('playground.docs')}
            >
              <IconifyIcon icon="mdi:book-open-variant" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </WorkspaceToolbar>
  );
};
