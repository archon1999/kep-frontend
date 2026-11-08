import { Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormHelperText,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import type { AdminField, AdminInlineRow } from 'modules/admin/domain';
import DialogHeader from 'shared/components/common/DialogHeader';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import { errorText } from '../helpers';
import SchemaField from './SchemaField';

const CodeEditor = lazy(() =>
  import('shared/components/code-workspace/CodeEditor').then((module) => ({
    default: module.CodeEditor,
  })),
);

export default function CodeTemplateDialog({
  row,
  languageName,
  extraField,
  disabled,
  errors,
  onApply,
  onClose,
}: {
  row: AdminInlineRow;
  languageName: string;
  extraField?: AdminField;
  disabled: boolean;
  errors?: Record<string, unknown>;
  onApply: (values: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [code, setCode] = useState(String(row.values.code_template ?? ''));
  const [extra, setExtra] = useState(extraField ? row.values[extraField.name] : null);
  const lang = String(row.values.lang || 'text');
  return (
    <Dialog open fullWidth maxWidth="lg" aria-labelledby="code-template-title" onClose={onClose}>
      <DialogHeader
        id="code-template-title"
        title={t('admin.console.fields.code_template')}
        onClose={onClose}
      />
      <DialogContent sx={{ pt: '16px !important' }}>
        <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
          <AttemptLanguage lang={lang} langFull={languageName} size={24} />
          <Typography fontWeight={600}>{languageName}</Typography>
        </Stack>
        <Box
          sx={{
            height: 'min(55dvh, 520px)',
            minHeight: 260,
            border: 1,
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          <Suspense fallback={<LinearProgress />}>
            <CodeEditor
              language={lang}
              value={code}
              onChange={(value) => setCode(value ?? '')}
              options={{ readOnly: disabled, ariaLabel: t('admin.console.fields.code_template') }}
            />
          </Suspense>
        </Box>
        {Boolean(errors?.code_template) && (
          <FormHelperText error>{errorText(errors?.code_template)}</FormHelperText>
        )}
        {extraField && (
          <Box sx={{ mt: 2, maxWidth: 280 }}>
            <SchemaField
              resourceKey="backend.problem"
              field={extraField}
              value={extra}
              values={row.values}
              disabled={disabled}
              error={errors?.[extraField.name]}
              onChange={setExtra}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="neutral" onClick={onClose}>
          {t(disabled ? 'common.close' : 'admin.actions.cancel')}
        </Button>
        {!disabled && (
          <Button
            variant="contained"
            onClick={() => {
              onApply({ code_template: code, ...(extraField ? { [extraField.name]: extra } : {}) });
              onClose();
            }}
          >
            {t('admin.workspace.apply')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
