import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, LinearProgress, Stack, Typography } from '@mui/material';

declare global {
  interface Window {
    Quill?: QuillConstructor;
  }
}

interface QuillInstance {
  root: HTMLDivElement;
  clipboard: {
    dangerouslyPasteHTML: (html: string) => void;
  };
  on: (eventName: string, handler: () => void) => void;
  off?: (eventName: string, handler: () => void) => void;
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

interface BlogRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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

  if (window.Quill) {
    return Promise.resolve(window.Quill);
  }

  if (quillLoaderPromise) {
    return quillLoaderPromise;
  }

  quillLoaderPromise = new Promise<QuillConstructor>((resolve, reject) => {
    if (!document.querySelector('link[data-blog-quill-style="true"]')) {
      const style = document.createElement('link');

      style.rel = 'stylesheet';
      style.href = QUILL_STYLE_URL;
      style.setAttribute('data-blog-quill-style', 'true');
      document.head.appendChild(style);
    }

    const existingScript = document.querySelector(
      'script[data-blog-quill-script="true"]',
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
    script.setAttribute('data-blog-quill-script', 'true');
    script.addEventListener('load', handleLoaded, { once: true });
    script.addEventListener('error', () => reject(new Error('Failed to load Quill')), {
      once: true,
    });

    document.body.appendChild(script);
  });

  return quillLoaderPromise;
};

const BlogRichTextEditor = ({ value, onChange, placeholder }: BlogRichTextEditorProps) => {
  const { t } = useTranslation();
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

        const quill = new Quill(hostRef.current, {
          theme: 'snow',
          modules: {
            toolbar: QUILL_TOOLBAR,
          },
          formats: QUILL_FORMATS,
          placeholder,
        });

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
  }, [placeholder]);

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
        <Alert severity="error">{t('blog.editor.loadError')}</Alert>
      ) : (
        <Box
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            '& .ql-toolbar.ql-snow': {
              border: 0,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            },
            '& .ql-container.ql-snow': {
              border: 0,
              minHeight: 320,
              fontFamily: 'inherit',
            },
            '& .ql-editor': {
              minHeight: 320,
              fontFamily: 'inherit',
              fontSize: 16,
              lineHeight: 1.75,
            },
          }}
        >
          <Box ref={hostRef} />
        </Box>
      )}
      <Typography variant="caption" color="text.secondary">
        {t('blog.editor.safeFormattingHint')}
      </Typography>
    </Stack>
  );
};

export default BlogRichTextEditor;
