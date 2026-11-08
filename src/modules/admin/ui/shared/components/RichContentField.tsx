import { Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Stack, Tab, Tabs } from '@mui/material';
import MathJaxView from 'shared/components/base/MathJaxView';
import { hasMathMarkup } from 'shared/lib/mathJax';

const RichTextEditor = lazy(() => import('shared/components/form/RichTextEditor'));

export default function RichContentField({
  value,
  label,
  quill,
  invalid,
  disabled,
  onChange,
}: {
  value: unknown;
  label: string;
  quill?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  onChange: (value: unknown) => void;
}) {
  const { t } = useTranslation();
  const html =
    quill && value && typeof value === 'object'
      ? String((value as { html?: string }).html ?? '')
      : String(value ?? '');
  const [preview, setPreview] = useState(() => Boolean(disabled || hasMathMarkup(html)));
  return (
    <Box>
      <Tabs
        value={disabled || preview ? 'preview' : 'edit'}
        onChange={(_, next) => setPreview(next === 'preview')}
        aria-label={label}
        sx={{
          mb: 1,
          minHeight: 32,
          '& .MuiTab-root': { minHeight: 32, px: 1.5, minWidth: 0, fontSize: 12 },
        }}
      >
        {!disabled && <Tab value="edit" label={t('admin.actions.edit')} />}
        <Tab value="preview" label={t('admin.workspace.preview')} />
      </Tabs>
      {!disabled && (
        <Box hidden={preview}>
          <Suspense fallback={<Skeleton variant="rectangular" height={220} />}>
            <RichTextEditor
              ariaLabel={label}
              ariaInvalid={invalid}
              value={html}
              onChange={quill ? () => undefined : onChange}
              onDocumentChange={quill ? onChange : undefined}
              enableMathJax
              compact
              minHeight={180}
            />
          </Suspense>
        </Box>
      )}
      {(disabled || preview) && (
        <Stack
          sx={{
            p: 2,
            minHeight: 220,
            border: 1,
            borderColor: 'divider',
            overflowWrap: 'anywhere',
            '& img': { maxWidth: '100%' },
          }}
        >
          <MathJaxView rawHtml={html || '<p>—</p>'} />
        </Stack>
      )}
    </Box>
  );
}
