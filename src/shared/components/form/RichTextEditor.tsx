import { useEffect, useRef, useState } from 'react';
import { Alert, Box, LinearProgress, Stack, Typography } from '@mui/material';
import * as katex from 'katex';
import 'katex/dist/katex.min.css';

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
  };
  on: (eventName: string, handler: () => void) => void;
  off?: (eventName: string, handler: () => void) => void;
  getLength?: () => number;
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
  value: string;
  onChange: (value: string) => void;
  loadErrorText?: string;
  hintText?: string;
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
  value,
  onChange,
  loadErrorText = 'Editor failed to load.',
  hintText,
  minHeight = 360,
  compact = false,
  enableMathJax = false,
  mathJaxPromptText = 'MathJax formula',
}: RichTextEditorProps) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const onChangeRef = useRef(onChange);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

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

                  const expression = window.prompt(mathJaxPromptText);

                  if (!expression?.trim()) {
                    return;
                  }

                  const selection = quill.getSelection?.(true);
                  const index = selection?.index ?? Math.max((quill.getLength?.() ?? 1) - 1, 0);
                  quill.insertEmbed?.(index, 'formula', expression.trim(), 'user');
                  quill.insertText?.(index + 1, ' ', 'user');
                  quill.setSelection?.(index + 2, 0, 'user');
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
        });
        quillHolder.current = quill;

        quill.clipboard.dangerouslyPasteHTML(normalizeEditorHtml(value));
        handler = () => {
          const nextValue = normalizeEditorHtml(quill.root.innerHTML);
          onChangeRef.current(nextValue);
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
      quill.clipboard.dangerouslyPasteHTML(nextValue);
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
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            '& .ql-toolbar.ql-snow': {
              border: 0,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              px: compact ? 1.25 : 2,
              py: compact ? 1 : 1.5,
              bgcolor: 'background.paper',
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
    </Stack>
  );
};

export default RichTextEditor;
