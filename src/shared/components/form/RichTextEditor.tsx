import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { overlayPaperStyles } from 'app/theme/styles/overlays';
import * as katex from 'katex';
import 'katex/dist/katex.min.css';
import DialogHeader from 'shared/components/common/DialogHeader';

declare global {
  interface Window {
    Quill?: QuillConstructor;
    katex?: typeof katex;
  }
}

interface QuillInstance {
  root: HTMLDivElement;
  clipboard: {
    dangerouslyPasteHTML: (html: string) => void;
    convert: (html: string) => unknown;
  };
  setContents: (delta: unknown, source?: string) => void;
  on: (eventName: string, handler: () => void) => void;
  off?: (eventName: string, handler: () => void) => void;
  getLength?: () => number;
  getContents: () => unknown;
  getSelection?: (focus?: boolean) => { index: number; length: number } | null;
  insertEmbed?: (index: number, type: string, value: unknown, source?: string) => void;
  insertText?: (index: number, text: string, source?: string) => void;
  setSelection?: (index: number, length?: number, source?: string) => void;
}

interface QuillConstructor {
  new (
    element: Element,
    options: {
      theme: string;
      modules: Record<string, unknown>;
      formats: string[];
      placeholder?: string;
    },
  ): QuillInstance;
}

interface RichTextEditorProps {
  ariaLabel?: string;
  ariaInvalid?: boolean;
  value: string;
  onChange: (value: string) => void;
  onDocumentChange?: (value: { html: string; delta: string }) => void;
  loadErrorText?: string;
  hintText?: string;
  placeholder?: string;
  minHeight?: number;
  compact?: boolean;
  enableMathJax?: boolean;
  mathJaxPromptText?: string;
}

const QUILL_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js';
const QUILL_STYLE_URL = 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css';
const QUILL_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
  ['clean'],
];
const QUILL_MATHJAX_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'mathjax'],
  ['clean'],
];
const QUILL_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'code-block',
  'list',
  'bullet',
  'link',
  'formula',
];

let quillLoaderPromise: Promise<QuillConstructor> | null = null;

const normalizeEditorHtml = (html?: string | null) => {
  const normalized = (html ?? '').trim();

  if (!normalized || normalized === '<p><br></p>') {
    return '';
  }

  return normalized;
};

const ensureQuillLoaded = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is unavailable'));
  }

  window.katex = katex;

  if (window.Quill) {
    return Promise.resolve(window.Quill);
  }

  if (quillLoaderPromise) {
    return quillLoaderPromise;
  }

  quillLoaderPromise = new Promise<QuillConstructor>((resolve, reject) => {
    if (!document.querySelector('link[data-kep-quill-style="true"]')) {
      const style = document.createElement('link');

      style.rel = 'stylesheet';
      style.href = QUILL_STYLE_URL;
      style.setAttribute('data-kep-quill-style', 'true');
      document.head.appendChild(style);
    }

    const existingScript = document.querySelector(
      'script[data-kep-quill-script="true"]',
    ) as HTMLScriptElement | null;

    const handleLoaded = () => {
      if (window.Quill) {
        resolve(window.Quill);
        return;
      }

      reject(new Error('Quill did not initialize'));
    };

    if (existingScript) {
      existingScript.addEventListener('load', handleLoaded, { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Quill')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');

    script.src = QUILL_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-kep-quill-script', 'true');
    script.addEventListener('load', handleLoaded, { once: true });
    script.addEventListener('error', () => reject(new Error('Failed to load Quill')), {
      once: true,
    });

    document.body.appendChild(script);
  });

  return quillLoaderPromise;
};

const RichTextEditor = ({
  ariaLabel,
  ariaInvalid,
  value,
  onChange,
  onDocumentChange,
  loadErrorText = 'Editor failed to load.',
  hintText,
  placeholder,
  minHeight = 360,
  compact = false,
  enableMathJax = false,
  mathJaxPromptText = 'MathJax formula',
}: RichTextEditorProps) => {
  const { t } = useTranslation();
  const formulaId = useId();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const onChangeRef = useRef(onChange);
  const onDocumentChangeRef = useRef(onDocumentChange);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [formulaIndex, setFormulaIndex] = useState<number | null>(null);
  const [expression, setExpression] = useState('');
  const [formulaError, setFormulaError] = useState(false);

  const insertFormula = () => {
    const quill = quillRef.current;
    const formula = expression.trim();
    if (!quill || formulaIndex === null || !formula) return;

    try {
      katex.renderToString(formula, { throwOnError: true });
    } catch {
      setFormulaError(true);
      return;
    }

    quill.insertEmbed?.(formulaIndex, 'formula', formula, 'user');
    quill.insertText?.(formulaIndex + 1, ' ', 'user');
    quill.setSelection?.(formulaIndex + 2, 0, 'user');
    setFormulaIndex(null);
  };

  useEffect(() => {
    onChangeRef.current = onChange;
    onDocumentChangeRef.current = onDocumentChange;
  }, [onChange, onDocumentChange]);

  useEffect(() => {
    const quill = quillRef.current;
    if (isLoading || !quill) return;
    quill.root.setAttribute('role', 'textbox');
    quill.root.setAttribute('aria-multiline', 'true');
    quill.root.setAttribute('aria-label', ariaLabel || t('common.editorTools.content'));
    quill.root.setAttribute('aria-invalid', String(Boolean(ariaInvalid)));
    const toolbar = hostRef.current?.parentElement?.querySelector('.ql-toolbar');
    const controls: Record<string, string> = {
      bold: 'bold',
      italic: 'italic',
      underline: 'underline',
      strike: 'strike',
      blockquote: 'quote',
      'code-block': 'code',
      link: 'link',
      clean: 'clear',
      mathjax: 'formula',
    };
    toolbar?.querySelectorAll('button').forEach((button) => {
      const tool = Object.keys(controls).find((name) => button.classList.contains('ql-' + name));
      const label = tool
        ? t(`common.editorTools.${controls[tool]}`)
        : button.classList.contains('ql-list')
          ? t(`common.editorTools.${button.value === 'ordered' ? 'numbered' : 'bulleted'}`)
          : '';
      if (label) {
        button.setAttribute('aria-label', label);
        button.title = label;
      }
    });
  }, [ariaLabel, ariaInvalid, isLoading, t]);

  useEffect(() => {
    let isMounted = true;
    let handler: (() => void) | null = null;

    ensureQuillLoaded()
      .then((Quill) => {
        if (!isMounted || !hostRef.current || quillRef.current) {
          return;
        }

        const quillHolder: { current: QuillInstance | null } = { current: null };
        const toolbar = enableMathJax
          ? {
              container: QUILL_MATHJAX_TOOLBAR,
              handlers: {
                mathjax: () => {
                  const quill = quillHolder.current;

                  if (!quill) {
                    return;
                  }

                  // Capture the cursor before focus moves to the dialog.
                  const selection = quill.getSelection?.(true);
                  const index = selection?.index ?? Math.max((quill.getLength?.() ?? 1) - 1, 0);
                  setExpression('');
                  setFormulaError(false);
                  setFormulaIndex(index);
                },
              },
            }
          : QUILL_TOOLBAR;

        const quill = new Quill(hostRef.current, {
          theme: 'snow',
          modules: {
            toolbar,
          },
          formats: QUILL_FORMATS,
          placeholder,
        });
        quillHolder.current = quill;

        // Importing content must not focus each editor and scroll a multi-editor form.
        quill.setContents(quill.clipboard.convert(normalizeEditorHtml(value)), 'silent');
        handler = () => {
          const nextValue = normalizeEditorHtml(quill.root.innerHTML);
          onChangeRef.current(nextValue);
          onDocumentChangeRef.current?.({
            html: nextValue,
            delta: JSON.stringify(quill.getContents()),
          });
        };
        quill.on('text-change', handler);
        quillRef.current = quill;
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setHasLoadError(true);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;

      if (quillRef.current && handler && typeof quillRef.current.off === 'function') {
        quillRef.current.off('text-change', handler);
      }

      quillRef.current = null;
    };
  }, [enableMathJax, mathJaxPromptText]);

  useEffect(() => {
    const quill = quillRef.current;

    if (!quill) {
      return;
    }

    const nextValue = normalizeEditorHtml(value);
    const currentValue = normalizeEditorHtml(quill.root.innerHTML);

    if (currentValue !== nextValue) {
      quill.setContents(quill.clipboard.convert(nextValue), 'silent');
    }
  }, [value]);

  return (
    <Stack direction="column" spacing={1.25}>
      {isLoading ? <LinearProgress color="primary" /> : null}
      {hasLoadError ? (
        <Alert severity="error">{loadErrorText}</Alert>
      ) : (
        <Box
          sx={{
            border: (theme) => `1px solid ${theme.vars.palette.divider}`,
            borderRadius: (theme) => (theme.preset === 'default' ? 0 : 1),
            bgcolor: 'background.paper',
            '&:focus-within': { borderColor: 'primary.main' },
            '& .ql-snow': { fontFamily: 'inherit', color: 'text.primary' },
            '& .ql-toolbar.ql-snow': {
              border: 0,
              borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}`,
              px: compact ? 1.25 : 2,
              py: compact ? 1 : 1.5,
              bgcolor: 'background.paper',
            },
            '& .ql-toolbar .ql-stroke': { stroke: (theme) => theme.vars.palette.text.secondary },
            '& .ql-toolbar .ql-fill': { fill: (theme) => theme.vars.palette.text.secondary },
            '& .ql-toolbar .ql-picker, & .ql-toolbar button': { color: 'text.secondary' },
            '& .ql-toolbar button:focus-visible, & .ql-picker-label:focus-visible': {
              outline: (theme) => `2px solid ${theme.vars.palette.primary.main}`,
              outlineOffset: 2,
            },
            '& .ql-picker-label:hover, & .ql-picker-item:hover, & .ql-picker-item.ql-selected': {
              color: 'primary.main',
            },
            '& .ql-picker.ql-expanded .ql-picker-label': {
              color: 'text.primary',
              borderColor: 'divider',
            },
            '& .ql-picker-options, & .ql-tooltip': (theme) => ({
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderColor: 'divider',
              boxShadow: theme.shadows[8],
              ...(theme.preset === 'default' ? overlayPaperStyles(theme) : {}),
            }),
            '& .ql-tooltip input[type="text"]': {
              bgcolor: 'background.default',
              color: 'text.primary',
              borderColor: 'divider',
            },
            '& .ql-container.ql-snow': {
              border: 0,
              minHeight,
              fontFamily: 'inherit',
            },
            '& .ql-editor': {
              minHeight,
              fontFamily: 'inherit',
              fontSize: compact ? 14 : 16,
              lineHeight: compact ? 1.65 : 1.75,
              p: compact ? 2 : 3,
            },
            '& .ql-editor.ql-blank::before': {
              left: compact ? 16 : 24,
              right: compact ? 16 : 24,
              color: 'text.secondary',
              fontStyle: 'normal',
              opacity: 0.72,
            },
            '& .ql-toolbar button.ql-mathjax::after': {
              content: '"fx"',
              fontSize: 12,
              fontWeight: 800,
              lineHeight: '24px',
            },
            '& .ql-editor .ql-formula': {
              cursor: 'text',
            },
            '& .ql-toolbar button:hover .ql-stroke, & .ql-toolbar button.ql-active .ql-stroke': {
              stroke: (theme) => theme.vars.palette.primary.main,
            },
            '& .ql-toolbar button:hover .ql-fill, & .ql-toolbar button.ql-active .ql-fill': {
              fill: (theme) => theme.vars.palette.primary.main,
            },
          }}
        >
          <Box ref={hostRef} />
        </Box>
      )}
      {hintText ? (
        <Typography variant="caption" color="text.secondary">
          {hintText}
        </Typography>
      ) : null}
      <Dialog
        open={formulaIndex !== null}
        onClose={() => setFormulaIndex(null)}
        maxWidth="sm"
        fullWidth
        aria-labelledby={`${formulaId}-title`}
      >
        <DialogHeader
          id={`${formulaId}-title`}
          title={mathJaxPromptText}
          onClose={() => setFormulaIndex(null)}
        />
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            label={mathJaxPromptText}
            value={expression}
            onChange={(event) => {
              setExpression(event.target.value);
              setFormulaError(false);
            }}
            error={formulaError}
            helperText={formulaError ? t('common.invalidFormula') : undefined}
          />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => setFormulaIndex(null)}>
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="contained"
            disabled={!expression.trim()}
            onClick={insertFormula}
          >
            {t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default RichTextEditor;
